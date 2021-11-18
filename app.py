from flask import Flask, render_template, request, redirect, url_for
from io import BytesIO
from PIL import Image
from base64 import b64encode
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import cv2

## PyTorch
import torch
import torchvision.transforms as transforms
import torch.nn.functional as F

## For Grad-Cam (pkg)
from pytorch_grad_cam import GradCAM

## RAM clean
import gc

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


def combine_cam(overlay, pil_img):
    mask_resized = cv2.resize(overlay, (pil_img.size[0], pil_img.size[1]), interpolation=cv2.INTER_LINEAR)
    heatmap = cv2.applyColorMap(np.uint8(255 * mask_resized ), cv2.COLORMAP_BONE)
    heatmap = np.float32(heatmap) / 255
    cam_both = np.multiply(heatmap, np.float32(pil_img))
    cam_both = cam_both / np.max(cam_both)
    return cam_both

def sigmoid(x, slope):
  return 1 / (1 + np.exp(-slope * x))

model_info_list = []
model_info_list.append(["1-Stringing", "stringing_best_model.pth", [False, True]])
model_info_list.append(["2-Underextrusion", "underextrusion_best_model.pth", [False, True]])
model_info_list.append(["3-LayerShifting", "layer_shifting_best_model.pth", [False, True]])
model_info_list.append(["4-Warping", "warping_best_model.pth", [False, True]])
model_info_list.append(["5-Blobs", "blobs_best_model.pth", [False, True]])

cols = "name,filename,labels".split(",")
model_info = pd.DataFrame(model_info_list, columns=cols)

## * ###################

map_threshold = 0.5
acc_threshold = 0.75

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
                output_vars = "err_name,top1prob_has_err,class_idx,overlay".split(",")
                df_results = pd.DataFrame(columns=output_vars)

                for m in model_info.index:
                    ## Load all models
                    model = torch.load("static/model/" + model_info.loc[m, "filename"], map_location=torch.device('cpu'))
                    a,b,c,d = get_prediction_gradcam_pkg(pil_img, model)

                    del model
                    gc.collect()

                    ## Convert to binary overlay map
                    # norm_threshold = map_threshold * (np.max(d) - np.min(d))  # % of range
                    # norm_threshold = np.quantile(d, 0.5)  # q-th quantile, 0.5-q == median

                    # d = (d > norm_threshold) * 0.99  # binary
                    # d = d * (d > norm_threshold)  # grad-binary
                    d = sigmoid((d) * 2 - 1, 8)  # sigmoid: range (-1, 1)

                    df_results = df_results.append(pd.Series((model_info.loc[m, "name"],b,c,0), index=output_vars), ignore_index=True)

                    ## Grad-Cam heatmap for model 1
                    img_io2 = BytesIO()
                    fig = plt.figure()

                    plt.imshow(cv2.cvtColor(combine_cam(d, pil_img), cv2.INTER_LINEAR))

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

                # Subset results of only >=80% top1prob_has_err
                if sum(df_results.top1prob_has_err >= acc_threshold) > 0:
                    df_sub = df_results.loc[df_results.top1prob_has_err >= acc_threshold, :]

                    card_info.append(df_sub.sort_values(by="top1prob_has_err", ascending=False).err_name.to_list())
                    card_info_prob.append(df_sub.sort_values(by="top1prob_has_err", ascending=False).top1prob_has_err.to_list())
                    
                else:
                    ## Store error info for cards
                    card_info.append(df_results.sort_values(by="top1prob_has_err", ascending=False).err_name.to_list())
                    card_info_prob.append(df_results.sort_values(by="top1prob_has_err", ascending=False).top1prob_has_err.to_list())

                del df_results
                gc.collect()


                ## Save temp img_path
                img_io = BytesIO()
                pil_img.save(img_io, 'JPEG', quality=100)
                img_io.seek(0)
                base64_img = b64encode(img_io.getvalue())
                img_path.append(base64_img.decode('ascii'))
                img_io.close()

                ## Overall maps
                img_io3 = BytesIO()
                fig = plt.figure()
                plt.imshow(pil_img, alpha=1)

                ax = fig.axes[0]
                ax.set_axis_off()
                ax.set_xticks([])
                ax.set_yticks([])
                plt.savefig(img_io3, format='JPEG', bbox_inches='tight', pad_inches=0)
                img_io3.seek(0)
                base64_img = b64encode(img_io3.getvalue())
                ## Append img to the end of []
                try:
                    img_path_cam[len(model_info.index)].append(base64_img.decode('ascii'))
                except:
                    img_path_cam.append([])  # one [] per model
                    img_path_cam[len(model_info.index)].append(base64_img.decode('ascii'))

                img_io3.close()

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


if __name__ == '__main__':
    app.jinja_env.cache = {}
    app.run(debug=True)
