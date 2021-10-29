// var script = document.createElement('script');
// script.src = something;

// let cropper = updateCropper("image-preview-{{ i }}");
// initCropImg("image-preview-{{ i }}", "{{ img_format }}{{ img_path[0] | safe }}");

// let input_storedata_id = "";
// let cropimg_storedata_id = "";

// var canvas_size;
// let cropdata;

function initCropDiv(tab_img_src) {
  // Init crop-div
  d3.select("#crop-div").selectAll("*").remove();

  d3.select("#crop-div")
    .append("form")
    .attr("id", "crop-form")
    .attr("method", "post")
    .attr("enctype", "multipart/form-data")
    .append("div")
    .attr("id", "preview-container")
    .append("img")
    .attr("id", "image-preview")
    .attr("src", tab_img_src)
    .attr("alt", "Image preview")
    .attr("style", "max-height: 400px;");

  d3.select("#crop-form")
    .append("input")
    .attr("type", "hidden")
    .attr("id", "input-storedata")
    .attr("name", "crop_input")
    .attr("value", "");

  d3.select("#crop-form")
    .append("input")
    .attr("type", "hidden")
    .attr("id", "cropimg-storedata")
    .attr("name", "crop_img")
    .attr("value", "");

  d3.select("#crop-form")
    .append("button")
    .attr("type", "submit")
    .text("Upload Image")
    .attr("class", "btn")
    .attr("id", "upload-crop-btn");
}

let auto_crop_input = false;
// let cropper = updateCropper("image-preview");

function toggleFunc() {
  if (auto_crop_input == false) {
    auto_crop_input = true;
  } else {
    auto_crop_input = false;
  }
}

function initCropImg(prev_id, img_src) {
  const preview = document.getElementById(prev_id);
  preview.src = img_src;

  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Load file info
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      cropper.replace(img_src);
    },
    false
  );
}

function updateCropper(prev_id) {
  const preview = document.getElementById(prev_id);

  const cropper = new Cropper(preview, {
    aspectRatio: NaN,
    crop(event) {
      canvas_size =
        (300 * preview.width) /
        Math.abs(Math.max(preview.width, preview.height));

      cropdata = cropper.getData();

      if (auto_crop_input == true) {
        // change by current toggle
        imageCrop(prev_id);
      }
    },
  });

  return cropper;
}

function imageCrop(prev_id) {
  const preview = document.getElementById(prev_id);
  const ctx = canvas.getContext("2d");

  const cropimg = preview.src.split("data:image/JPEG;base64,")[1];

  let r_corr = cropdata.x + cropdata.width;
  let b_corr = cropdata.y + cropdata.height;
  let l_corr = cropdata.x > 0 ? cropdata.x : 0;
  let t_corr = cropdata.y > 0 ? cropdata.y : 0;
  r_corr = r_corr > preview.width ? preview.width : r_corr;
  b_corr = b_corr > preview.height ? preview.height : b_corr;

  document.getElementById("input-storedata").value +=
    [l_corr, t_corr, r_corr, b_corr] + ",";
  document.getElementById("cropimg-storedata").value = cropimg;

  ctx.drawImage(
    preview,
    cropdata.x,
    cropdata.y,
    cropdata.width,
    cropdata.height,
    (cropdata.x / preview.width) * canvas_size,
    (cropdata.y / preview.width) * canvas_size,
    (cropdata.width / preview.width) * canvas_size,
    (cropdata.height / preview.width) * canvas_size
  );
}

function resetCrop() {
  const ctx = canvas.getContext("2d");
  document.getElementById("input-storedata").value = "";
  document.getElementById("cropimg-storedata").value = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
