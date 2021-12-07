from flask import Flask, render_template, request, redirect, url_for
from io import BytesIO
from PIL import Image
from base64 import b64encode, b64decode
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import cv2
import json

## PyTorch
import torch
import torchvision.transforms as transforms
import torch.nn.functional as F

## For Grad-Cam (pkg)
from pytorch_grad_cam import GradCAM

## RAM clean
import gc
import matplotlib

matplotlib.use('Agg')

def transform_image(pil_img):
    my_transforms = transforms.Compose([transforms.Resize(224),  # 255
                                        transforms.CenterCrop(224),
                                        transforms.ToTensor(),
                                        transforms.Normalize(
                                            [0.485, 0.456, 0.406],
                                            [0.229, 0.224, 0.225])])
    tran_img = my_transforms(pil_img).unsqueeze(0)
    return tran_img

def get_prediction_gradcam_pkg(pil_img, model):
    
    class_list = [False, True]
    
    target_layer = model.layer4[-1]

    cam = GradCAM(model=model, 
                  target_layer=target_layer,
                  use_cuda=False)

    input_tensor = transform_image(pil_img=pil_img)

    grayscale_cam = cam(input_tensor=input_tensor,
                        target_category=None,
                        aug_smooth=None,
                        eigen_smooth=None)

    # Here grayscale_cam has only one image in the batch
    grayscale_cam = grayscale_cam[0, :]

    ## Prediction
    _ = model.eval()
    outputs = model(input_tensor)
    pred_probabilities = F.softmax(outputs).data.squeeze()
    top1prob = torch.topk(pred_probabilities, 1)[0][0]  # Top-1 prediction
    class_idx = int(torch.topk(pred_probabilities, 1)[1])
    
    if class_idx == 1:
        top1prob_has_err = float(top1prob)
    else:
        top1prob_has_err = 1 - float(top1prob)

    return class_idx, top1prob_has_err, class_list[int(class_idx)], grayscale_cam #cam_image


def combine_cam(overlay, pil_img, img_max_h):
    # img_max_w = 120
    # img_max_h = int(img_max_w / pil_img.size[0] * pil_img.size[1])
    img_max_w = int(img_max_h / pil_img.size[1] * pil_img.size[0])

    mask_resized = cv2.resize(overlay, (img_max_w, img_max_h), interpolation=cv2.INTER_LINEAR)
    heatmap = cv2.applyColorMap(np.uint8(255 * mask_resized), cv2.COLORMAP_BONE)
    heatmap = np.float32(heatmap) / 255
    cam_both = np.multiply(heatmap, cv2.resize(np.float32(pil_img), (img_max_w, img_max_h)))
    cam_both = cam_both / np.max(cam_both)
    return cam_both

def sigmoid(x, slope):
  return 1 / (1 + np.exp(-slope * x))

def multiple_crop_overlap_size(overlay_sigmoid, img_reduced_size, js_crop_input, mode='iou'):
    """img_reduced_size = (img_max_w, img_max_h)"""
    area_list = js_crop_input.split(",")[:-1]
    crop_area = np.reshape([round(float(i)) for i in area_list], (-1, 4))
    
    map_threshold = 0.5
    norm_threshold = map_threshold * (np.max(overlay_sigmoid) - np.min(overlay_sigmoid))  # % of range
    # overlay_bin = (overlay_sigmoid > norm_threshold) * 0.99  ## high score == attention area == white
    # overlay_bin = np.float32(cv2.resize(overlay_bin, img_reduced_size))

    overlay_bin = cv2.resize(overlay_sigmoid, img_reduced_size)
    overlay_bin = np.float32((overlay_bin > norm_threshold) * 0.99)  ## high score == attention area == white

    pil_img_blank = Image.fromarray(np.uint8((overlay_bin > -1) * 0.99 * 255))
    crop_only_img = Image.new('RGB', img_reduced_size)
    for area in crop_area:
        im = pil_img_blank.crop(area)  
        crop_only_img.paste(im, (area[0], area[1]))

    crop_only_bin = cv2.cvtColor(np.float32(crop_only_img), cv2.COLOR_RGB2GRAY)
    crop_only_bin = np.float32((crop_only_bin > 0) * 0.99)

    if mode == 'iou':
        intersection = np.logical_and(overlay_bin, crop_only_bin)
        union = np.logical_or(overlay_bin, crop_only_bin)
        iou_score = np.sum(intersection) / np.sum(union)
        res_output = iou_score

    elif mode == 'overlap':  # Combine and count num of overlapped px
        pil_img_bin = Image.fromarray(np.uint8(overlay_bin * 255))
        
        final_img = Image.new('RGB', img_reduced_size)
        for area in crop_area:
            im = pil_img_bin.crop(area)  
            final_img.paste(im, (area[0], area[1]))
        
        overlap_matrix = cv2.cvtColor(np.float32(final_img), cv2.COLOR_RGB2GRAY)
        overlap_matrix = np.float32((overlap_matrix > 0) * 0.99)
        res_output = np.sum(overlap_matrix > 0)

    else:
        res_output = -1
    
    return res_output

model_info_list = []
model_info_list.append(["1-Stringing", "stringing_best_model.pth", [False, True]])
model_info_list.append(["2-Underextrusion", "under-extrusion_best_model.pth", [False, True]])
model_info_list.append(["3-LayerShifting", "layer_shifting_best_model.pth", [False, True]])
model_info_list.append(["4-Warping", "warping_best_model.pth", [False, True]])
model_info_list.append(["5-Blobs", "blobs_best_model.pth", [False, True]])

cols = "name,filename,labels".split(",")
model_info = pd.DataFrame(model_info_list, columns=cols)
output_pred = []  # to store multiple df_results

## * ###################

map_threshold = 0.5
acc_threshold = 0.75
sigmoid_slop = 4
# img_max_w = 400  # image resolution before combine_cam
img_max_h = 360  # image resolution before combine_cam

## * ###################



app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def index():
    text = ""

    if request.method == 'POST':
        if 'img-file' not in request.files:
            return redirect(request.url)
        
        # file = request.files.get('img-file')
        img_path = []
        text_names = ""

        img_path_cam = [[]]#[[], []]
        global output_pred
        output_pred = []  # to store multiple df_results
        card_info = []
        card_info_prob = []


        for file in request.files.getlist("img-file"):
            ## Check if "file" is any kind of zero or empty container (None), or False
            if not file:  
                pass
            
            else:

                img_bytes = file.read()
                pil_img = Image.open(BytesIO(img_bytes))


                ## Predicting
                # output_vars = "err_name,top1prob_has_err,class_idx,overlay".split(",")
                output_vars = "err_name,top1prob_has_err,img_reduced_size,overlay".split(",")
                df_results = pd.DataFrame(columns=output_vars)

                # img_max_h = int(img_max_w / pil_img.size[0] * pil_img.size[1])
                img_max_w = int(img_max_h / pil_img.size[1] * pil_img.size[0])

                for m in model_info.index:
                    ## Load all models
                    model = torch.load("static/model/" + model_info.loc[m, "filename"], map_location=torch.device('cpu'))
                    a,b,c,d = get_prediction_gradcam_pkg(pil_img, model)

                    del model
                    gc.collect()

                    ## Convert to binary overlay map
                    # norm_threshold = map_threshold * (np.max(d) - np.min(d))  # % of range
                    ## norm_threshold = np.quantile(d, 0.5)  # q-th quantile, 0.5-q == median

                    # d = (d > norm_threshold) * 0.99  # binary
                    # d = d * (d > norm_threshold)  # grad-binary
                    d = sigmoid((d) * 2 - 1, sigmoid_slop)  # sigmoid: range (-1, 1)

                    # overlay_io = BytesIO()
                    # np.savez(overlay_io, x=d)

                    # overlay_io.seek(0)
                    # base64_overlay = b64encode(overlay_io.getvalue()).decode('ascii')

                    df_results = df_results.append(pd.Series((model_info.loc[m, "name"],b,str((img_max_w, img_max_h)),d), index=output_vars), ignore_index=True)

                    # overlay_io.close()

                    ## Grad-Cam heatmap for model 1
                    img_io2 = BytesIO()
                    fig = plt.figure()

                    # plt.imshow(cv2.cvtColor(combine_cam(d, pil_img, img_max_w), cv2.INTER_LINEAR))
                    plt.imshow(cv2.cvtColor(combine_cam(d, pil_img, img_max_h), cv2.INTER_LINEAR))

                    del d
                    gc.collect()

                    ax = fig.axes[0]
                    ax.set_axis_off()
                    ax.set_xticks([])
                    ax.set_yticks([])
                    plt.savefig(img_io2, format='JPEG', bbox_inches='tight', pad_inches=0)
                    img_io2.seek(0)
                    base64_img = b64encode(img_io2.getvalue())
                    try:
                        img_path_cam[m].append(base64_img.decode('ascii'))
                    except:
                        img_path_cam.append([])  # one [] per model
                        img_path_cam[m].append(base64_img.decode('ascii'))

                    img_io2.close()
                

                ## Store df in a list, 1 df per image
                output_pred.append(df_results)

                # Subset results of only >=75% top1prob_has_err
                if sum(df_results.top1prob_has_err >= acc_threshold) > 1000: #0:
                    df_sub = df_results.loc[df_results.top1prob_has_err >= acc_threshold, :]

                    card_info.append(df_sub.sort_values(by="top1prob_has_err", ascending=False).err_name.to_list())
                    card_info_prob.append(df_sub.sort_values(by="top1prob_has_err", ascending=False).top1prob_has_err.to_list())
                    
                else:
                    ## Store error info for cards
                    card_info.append(df_results.sort_values(by="top1prob_has_err", ascending=False).err_name.to_list())
                    card_info_prob.append(df_results.sort_values(by="top1prob_has_err", ascending=False).top1prob_has_err.to_list())

                del df_results
                gc.collect()

                ## Original image (resized)
                img_io = BytesIO()
                fig = plt.figure()
                
                img_reduced = cv2.resize(np.float32(pil_img),(img_max_w, img_max_h))
                img_reduced = img_reduced / np.max(img_reduced)

                plt.imshow(cv2.cvtColor(img_reduced, cv2.INTER_LINEAR))

                del img_reduced
                gc.collect()

                ax = fig.axes[0]
                ax.set_axis_off()
                ax.set_xticks([])
                ax.set_yticks([])
                plt.savefig(img_io, format='JPEG', bbox_inches='tight', pad_inches=0)
                img_io.seek(0)
                base64_img = b64encode(img_io.getvalue())
                img_path.append(base64_img.decode('ascii'))
                img_io.close()

                del pil_img
                gc.collect()

                text_names += str(file).split("'")[1] + "; "

        if len(img_path) > 0:
            return render_template("index.html", img_format='data:image/JPEG;base64,', svg_format='data:image/SVG+xml;base64,', img_path=img_path, n_img=len(img_path),output=text + str(len(img_path)) + " file(s) -- " + text_names,card_info=card_info, init_hide=False,
            output_pred=output_pred,
            img_path_cam=img_path_cam,
            card_info_prob=card_info_prob)

        else: 
            pass

    return render_template("init.html", img_format='', img_path=['/static/images/init.svg'], n_img=0, output=text + "0 files.", card_info=[["Init-card"]], init_hide=True)



@app.route('/<cmd>')
def command(cmd=None):
    
    # camera_command = cmd[0].upper()
    # multiple_crop_overlap_size(output_pred[0].overlay[2], output_pred[0].img_reduced_size[0], cmd)
    # response = np.load(BytesIO(b64decode(str(cmd).encode('ascii'))))['x'].shape
    # response = str(len(cmd))
    # response = "Moving {}".format(cmd.capitalize())
    # js_input_list = str(cmd).split("|")
    # len_list = len(js_input_list)
    # overlay_sigmoid = js_input_list[:(len_list-2)]
    # img_reduced_size, js_crop_input = js_input_list[(len_list-2):]
    # img_reduced_size = eval(img_reduced_size)  # convert string tuple to tuple

    # overlap_res = '{'
    # for m in range(len_list-2):
    #     overlap_res += f'"{model_info.name[m]}: "'
    #     overlay_sigmoid_sub = np.float32(json.loads([overlay_sigmoid][m]))
    #     overlap_res += multiple_crop_overlap_size(np.float32(json.loads(overlay_sigmoid_sub)), img_reduced_size, js_crop_input) + ','
    # # response = multiple_crop_overlap_size(overlay_sigmoid, img_reduced_size, '73.49249999999998,44.28,188.805,279.51750000000004,36.592499999999966,160.51500000000001,458.175,225.09000000000003,')
    # overlap_res = '}'

    global output_pred

    ## Get input from JS
    js_crop_input = str(cmd)
    # overlay_sigmoid = np.float32(json.loads(overlay_sigmoid))

    # overlap_res = multiple_crop_overlap_size(output_pred[0].overlay[1], img_reduced_size, js_crop_input)
    
    # overlap_res = '{'
    # for m in range(len(model_info)):
    #     overlap_res += f'"{model_info.name[m]}": '
    #     overlay_sigmoid_sub = output_pred[0].overlay[m]
    #     overlap_res += (str(multiple_crop_overlap_size(overlay_sigmoid_sub, img_reduced_size, js_crop_input)) + ',')
    # overlap_res = []
    # overlap_res += '}'

    if js_crop_input == '':
        overlap_res = 'No cropping'
    else:
        img_reduced_size = eval(output_pred[0].img_reduced_size[0])  # convert string tuple to tuple
        df_rank_crop = pd.DataFrame(columns=['name', 'overlap_iou'])
        df_rank_crop.name = model_info.name
        rank_model = []
        rank_model_px = []

        for m in range(len(df_rank_crop)):
            overlay_sigmoid_sub = output_pred[0].overlay[m]
            df_rank_crop.loc[m, 'overlap_iou'] = round(multiple_crop_overlap_size(overlay_sigmoid_sub, img_reduced_size, js_crop_input), 3)

        rank_model.append(df_rank_crop.sort_values(by="overlap_iou", ascending=False).name.to_list())
        rank_model_px.append(df_rank_crop.sort_values(by="overlap_iou", ascending=False).overlap_iou.to_list())

        # overlap_res = json.dumps(rank_model) + "<br>" + json.dumps(rank_model_px)
        overlap_res = rank_model + rank_model_px + [js_crop_input]

        del js_crop_input
        del overlay_sigmoid_sub
        gc.collect()

    # ser.write(camera_command)
    return str(overlap_res), 200, {'Content-Type': 'text/plain'}


if __name__ == '__main__':
    app.jinja_env.cache = {}
    app.run(debug=True)
