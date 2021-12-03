$(document).ready(() => savePage.start());

const savePage = new (function () {
  this.urlInput = "#url-input";
  this.exportButton = "#export-button";
  this.downloadButton = "#download-button";

  this.start = () => {
    this.applyHandle();
  };

  this.applyHandle = () => {
    $(this.exportButton).on("click", this.exportHandle);
    $(this.downloadButton).on("click", this.downloadHandle);
  };

  this.renderResult = (pdf) => {
    $(pdf).attr("id", "pdf-file");
    $(pdf).addClass("rounded-xl");
    $(pdf).addClass("h-96");
    $("#main-panel").empty();
    $("#main-panel").addClass("gap-4");
    $("#main-panel").append(pdf);
    $("#main-panel").append(this.downloadButtonTemplate);
    this.applyHandle();
  };

  this.downloadHandle = () => {
    var image = $("#pdf-file").attr("src");
    var link = document.createElement("a");

    document.body.appendChild(link); // for Firefox

    link.setAttribute("href", image);
    link.setAttribute("download", "file.pdf");
    link.click();
    link.remove();
  };

  this.exportHandle = () => {
    console.log($(this.urlInput).val());
    var baseURL = CONSTANT.baseURL;
    var urlTarget = $(this.urlInput).val();
    $.ajax({
      url: baseURL + CONSTANT.savePdfPath,
      type: "get",
      xhr: () => {
        // Seems like the only way to get access to the xhr object
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        return xhr;
      },
      data: {
        url: urlTarget,
      },
    })
      .done((result) => {
        console.log(result);
        var reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = () => {
          var base64data = reader.result;
          var pdf = $(`<embed src="" type="application/pdf"></embed>`);
          pdf.attr("src", base64data);
          this.renderResult(pdf);
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
