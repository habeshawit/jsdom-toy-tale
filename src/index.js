let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener('submit', (event) => {
        event.preventDefault()
        submitToy(event.target)
      })
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

const toyCollection = document.getElementById('toy-collection');

fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(json => json.forEach(toy => {
    renderToy(toy)
  }))
    

function renderToy(toy){
  let divCard = document.createElement('div');
  divCard.class = "card";

  let newH2 = document.createElement('h2');
  newH2.innerHTML = toy['name'];

  let newImg = document.createElement('img');
  newImg.className = "toy-avatar";
  newImg.src = toy['image'];

  let newP = document.createElement('p');
  newP.innerHTML = `${toy["likes"]} likes`;

  let newBtn = document.createElement('button');
  newBtn.className = "like-btn";
  newBtn.id = toy['id'];
  newBtn.innerHTML = "Like ❤️";

  newBtn.addEventListener('click', event =>{
    increaseToyLikes(event);
  })

  divCard.append(newH2, newImg, newP, newBtn);
  toyCollection.append(divCard);

}

function submitToy(toyData){
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "name": toyData.name.value, 
      "image": toyData.image.value, 
      "likes": 0
    })    
  })
  .then(response => response.json()) 
  .then(json => renderToy(json))
}

function increaseToyLikes(event){
  event.preventDefault();
  let addLikes = parseInt(event.target.previousElementSibling.innerText) +1;

  fetch(`http://localhost:3000/toys/${event.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": addLikes
    })
  })
  .then(response => response.json())
  .then(json => {
    event.target.previousElementSibling.innerText = `${addLikes} likes`;
  })
}
