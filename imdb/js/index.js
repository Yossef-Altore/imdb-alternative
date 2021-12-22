let theTitle = document.getElementById("theTitle");
let mainDiv = document.getElementById("mainDiv");
theTitle.focus();
async function getSearchResult() {
  let results = await fetch(
    `https://imdb8.p.rapidapi.com/title/find?q=${theTitle.value}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "imdb8.p.rapidapi.com",
        "x-rapidapi-key": "22b8b80f67msh6c02e74244be0f1p18538fjsn636fed89c4fe",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => json.results)
    .catch((err) => {
      console.error(err);
    });
  theTitle.value = "";
  /*  console.log(results); */
  if (results !== undefined) {
    renderResults(results);
  } else {
    alert("no result! try again");
  }
  theTitle.focus();
}

function renderResults(results) {
  mainDiv.innerHTML = "";
  for (result of results) {
    let idSplit = result.id.split("/");
    let codeOfTitle = idSplit.splice(2, 1);
    codeOfTitle = codeOfTitle[0];
    let resultID = result.id;
    let isItTitle = resultID.indexOf("title");
    if (isItTitle !== -1) {
      let titleType = result.titleType;
      if (titleType == "tvSeries" || titleType == "movie") {
        try {
          mainDiv.innerHTML += `
        <div class="aboutMovieOrSeries">
            <img src="${result.image.url}" alt="">
            <div>
              <h2>${result.title}</h2>
              <h2>${result.titleType}</h2>
            </div
            <div>
              <button value="${codeOfTitle}" onclick="showImages(this.value)">Images</button>
              <button value="${codeOfTitle}" onclick="showCast(this.value)">Cast</button>
            </div>  
        </div>
      `;
        } catch {
          mainDiv.innerHTML += `
          <div class="aboutMovieOrSeries">
             <img src="./images/noImage.png" alt="">
            <div>
              <h2>${result.title}</h2>
              <h2>${result.titleType}</h2>
            </div
            <div>
              <button value="${codeOfTitle}" onclick="showImages(this.value)">Images</button>
              <button value="${codeOfTitle}" onclick="showCast(this.value)">Cast</button>
            </div>  
        </div>
      `;
        }
      }
    }
  }
}

document.getElementById("searchBtn").addEventListener("click", getSearchResult);
document.getElementById("theTitle").addEventListener("keyup", function (event) {
  console.log(event);
  event.preventDefault();
  if (event.keyCode === 13) {
    getSearchResult();
  }
});

async function showImages(theId) {
  let images = await fetch(
    `https://imdb8.p.rapidapi.com/title/get-images?tconst=${theId}&limit=50`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "imdb8.p.rapidapi.com",
        "x-rapidapi-key": "22b8b80f67msh6c02e74244be0f1p18538fjsn636fed89c4fe",
      },
    }
  )
    .then((response) => response.json())
    .then((json) => json.images);
  mainDiv.innerHTML = "";
  for (image of images) {
    let caption = image.caption;
    let createdOn = image.createdOn;
    let url = image.url;
    mainDiv.innerHTML += `
      <div class="aboutMovieOrSeries">
            <img src="${url}" alt="">
            <div>
              <h2>${caption}</h2>
              <h2>${createdOn}</h2>
            </div
        </div>
    `;
  }
}
async function showCast(theId) {
  let results = await fetch(
    `https://imdb8.p.rapidapi.com/title/get-top-cast?tconst=${theId}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "imdb8.p.rapidapi.com",
        "x-rapidapi-key": "22b8b80f67msh6c02e74244be0f1p18538fjsn636fed89c4fe",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => json)
    .catch((err) => {
      console.error(err);
    });
  let listOfNames = new Array();
  for (result of results) {
    let idSplit = result.split("/");
    let codeOfName = idSplit.splice(2, 1);
    listOfNames.push(codeOfName[0]);
  }
  let castMember;
  mainDiv.innerHTML = "";
  for (name of listOfNames) {
    castMember = await fetch(
      `https://imdb8.p.rapidapi.com/actors/get-bio?nconst=${name}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "imdb8.p.rapidapi.com",
          "x-rapidapi-key":
            "22b8b80f67msh6c02e74244be0f1p18538fjsn636fed89c4fe",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => json)
      .catch((err) => {
        console.error(err);
      });
    console.log(castMember);

    try {
      mainDiv.innerHTML += `
      <div class="aboutMovieOrSeries">
            <img src="${castMember.image.url}" alt="">
            <div>
              <h2>${castMember.name}</h2>
              <h2>${castMember.birthDate}</h2>
            </div
        </div>
    `;
    } catch {
      mainDiv.innerHTML += `
      <div class="aboutMovieOrSeries">
            <img src="./images/noImage.png" alt="">
            <div>
              <h2>${castMember.name}</h2>
              <h2>${castMember.birthDate}</h2>
            </div
        </div>
    `;
    }
  }
}
