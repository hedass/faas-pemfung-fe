$(document).ready(() => compressImage.start());

$.fn.replaceClass = function (pFromClass, pToClass) {
  return this.removeClass(pFromClass).addClass(pToClass);
};

const compressImage = new (function () {
  this.compressButton = "#compress-button";
  this.browseButton = "#browse-button";
  this.downloadButton = "#download-button";
  this.imageContainer = "#container-image";
  this.inputImage = "#input-image";
  this.dropzone = "#dropzone";
  this.file;
  this.base64Img;

  this.start = () => {
    this.applyHandle();
  };

  this.applyHandle = () => {
    $(this.compressButton).on("click", this.compressHandle);
    $(this.downloadButton).on("click", this.downloadHandle);
    this.imageInputHandle();
  };

  this.renderResult = (pdf) => {
    $(pdf).attr("id", "image-resized-result");
    $(pdf).addClass("rounded-xl");
    $(pdf).addClass("h-96");
    $("#main-panel").empty();
    $("#main-panel").addClass("gap-4");
    $("#main-panel").append(pdf);
    $("#main-panel").append(this.downloadButtonTemplate);
    this.applyHandle();
  };

  this.downloadHandle = () => {
    var image = $("#image-resized-result").attr("src");
    var link = document.createElement("a");

    document.body.appendChild(link); // for Firefox

    link.setAttribute("href", image);
    link.setAttribute(
      "download",
      "image_resized." + this.file.type.split("/")[1]
    );
    link.click();
    link.remove();
  };

  this.compressHandle = () => {
    console.log(this.file);
    if (!this.file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please provide an image!",
      });
    }
    var baseURL = CONSTANT.baseURL;
    var data = new FormData();
    data.append("file", this.file);
    // jQuery.each(this.file, function (i, file) {
    //   data.append("file-" + i, file);
    // });
    $.ajax({
      url: baseURL + CONSTANT.compressImage,
      cache: false,
      contentType: false,
      processData: false,
      method: "POST",
      type: "POST",
      data: data,
      xhr: () => {
        // Seems like the only way to get access to the xhr object
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        return xhr;
      },
    })
      .done((result) => {
        console.log(result);
        var reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = () => {
          var base64data = reader.result;
          var image = new Image();
          image.onload = () => {
            this.renderResult(image);
          };
          image.src = base64data;
        };
      })
      .fail((error) => {
        console.log("error");
        console.log(error);
      });
  };

  this.imageInputHandle = () => {
    $(this.dropzone).on("dragover", (event) => {
      event.preventDefault();
      $(this.imageContainer).replaceClass("border-dashed", "border-solid");
      $(this.imageContainer).replaceClass("text-white", "text-gray-900");
      $(this.imageContainer).addClass("bg-gray-400");
    });
    $(this.dropzone).on("dragleave", (event) => {
      event.preventDefault();
      $(this.imageContainer).replaceClass("border-solid", "border-dashed");
      $(this.imageContainer).replaceClass("text-gray-900", "text-white");
      $(this.imageContainer).removeClass("bg-gray-400");
    });
    $(this.dropzone).on("drop", (event) => {
      event.preventDefault();
      this.file = event.originalEvent.dataTransfer.files[0];
      $(this.imageContainer).replaceClass("border-dashed", "border-solid");
      $(this.imageContainer).removeClass("bg-gray-400");
      this.showImage(this.file, this.imageContainer);
    });

    $(this.browseButton).on("click", () => {
      $(this.inputImage).click(); //if user click on the button then the input also clicked
    });

    $(this.inputImage).on("input", (event) => {
      //getting user select file and [0] this means if user select multiple files then we'll select only the first one
      this.file = event.target.files[0];
      this.showImage(this.file, this.imageContainer); //calling function
    });
  };

  this.showImage = (file, targetId) => {
    let fileType = file.type;
    let fileURL = "";
    // let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (fileType.match("image.*")) {
      let fileReader = new FileReader();
      fileReader.onload = async () => {
        this.imageUpdate(fileReader.result, targetId);
        this.base64Img = fileReader.result;
      };
      fileReader.readAsDataURL(file);
    } else {
      Alert(
        "Please use a valid image format like jpg, jpeg or png!",
        true,
        "error",
        "Image not supported"
      );
    }
  };

  this.imageUpdate = (fileURL, targetId) => {
    $(targetId).html(this.imageTemplate(fileURL));
  };

  this.imageTemplate = (fileURL) => {
    return `
    <div class="absolute top-1 right-2 text-2xl text-red-700 cursor-pointer" onclick="window.location.reload();"><i class="fas fa-times-circle"></i></div>
    <img src="${fileURL}" alt="image" class="object-contain w-full h-full">
    `;
  };

  this.downloadButtonTemplate = `
    <div
      id="download-button"
      class="
        text-white
        font-bold
        px-2
        py-4
        text-center
        rounded-md
        bg-blue-500
        text-lg
        w-1/4
        cursor-pointer
      "
    >
      <i class="fas fa-download"></i>
      Unduh
    </div>
  `;
})();
