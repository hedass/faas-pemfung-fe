$(document).ready(() => ScreenShootPage.start());

const ScreenShootPage = new (function () {
  this.urlInput = "#url-input";
  this.widthInput = "#width-input";
  this.heightInput = "#height-input";
  this.screenShootButton = "#screenshoot-button";
  this.downloadButton = "#download-button";
  this.path = "/page-screenshot";

  this.start = () => {
    this.applyHandle();
  };

  this.applyHandle = () => {
    $(this.screenShootButton).on("click", this.screenShootHandle);
    $(this.downloadButton).on("click", this.downloadHandle);
  };

  this.renderResult = (image) => {
    $(image).attr("id", "screenshoot-image");
    $(image).addClass("rounded-xl");
    $(image).addClass("h-96");
    $("#main-panel").empty();
    $("#main-panel").addClass("gap-4");
    $("#main-panel").append(image);
    $("#main-panel").append(this.downloadButtonTemplate);
    this.applyHandle();
  };

  this.downloadHandle = () => {
    var image = $("#screenshoot-image").attr("src");
    var link = document.createElement("a");

    document.body.appendChild(link); // for Firefox

    link.setAttribute("href", image);
    link.setAttribute("download", "Screenshoot.png");
    link.click();
    link.remove();
  };

  this.screenShootHandle = () => {
    console.log($(this.urlInput).val());
    console.log($(this.widthInput).val());
    console.log($(this.heightInput).val());
    var baseURL = CONSTANT.baseURL;
    var urlTarget = $(this.urlInput).val();
    var width = $(this.widthInput).val();
    var height = $(this.heightInput).val();
    $.ajax({
      url: baseURL + CONSTANT.screenShootPath,
      type: "get",
      xhr: () => {
        // Seems like the only way to get access to the xhr object
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        return xhr;
      },
      data: {
        url: urlTarget,
        width: width,
        height: height,
      },
    })
      .done((result) => {
        // console.log(result);
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
