/***
 *  user api https://randomuser.me/api/ for list users
 *
 *
 *
 ***/

(async function load() {
  /* async function getData(params) {
    const response = await fetch(`https://reqres.in/api/${params}`);
    const { data } = await response.json();
    return data ? data : null;
  } */
  const size = 768;
  async function getData(profile = false) {
    const response = await fetch(`https://randomuser.me/api/?results=10`);
    const { results } = await response.json();
    if (profile) {
      return results[0];
    }
    return results ? results : null;
  }
  async function profile() {
    const { name, picture } = await getData(true);
    //console.log(name, picture);
  }
  profile();

  function CreateTemplate(htmlString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = htmlString;
    return html.body.children[0];
  }

  function template_list_user(id,name, picture, index) {    
    return `<div class="list-item ${index == 0 ? " active" : ""}" data-id="${id}">
      <div class="avatar">
        ${index < 3 ? '<span class="active"></span>' : ""}
        ${index >= 3 && index <= 5 ? "<span></span>" : ""}
        <img
          height="35"
          src="${picture.medium}"
        />
      </div>
      <div class="info">
        ${index == 3 || index == 5 ? "<span>10</span>" : ""}
        <strong> ${name.first + " " + name.last} </strong>
        <p> Lorem ipsum, dolor sit amet consectetur adipisicing elit. </p>
      </div>
    </div>;`;
  }

  const userList = await getData();

  let contactList = document.querySelector("#contact-list");
  if (contactList != null) {
    userList.map((element, index) => {
      const {login, name, picture } = element;
      const item = template_list_user(login.uuid, name, picture, index);
      contactList.append(CreateTemplate(item));
    });
  }
  let main = document.querySelector("main");

  function resize() {
    if (window.innerWidth <= size) {
      main.classList.add("fixed");
    }
  }

  window.addEventListener("resize", resize());
  resize();

  const showMessage = () => {
    if (window.innerWidth <= size) {
      main.classList.toggle("active");
    }
  };
  const activeMessage = (element)=>{
    let img = element.querySelector('.avatar>img').src;
    let name = element.querySelector(".info>strong").textContent;
    document.querySelector(".message-info>.avatar>img").src = img;
    document.querySelector(".message-info>.info>span").textContent = name;
    console.log(img,name)
  }
  let back = document.querySelector(".back");
  back.addEventListener("click", () => showMessage());
  let items = document.querySelectorAll(".list-item");
  items.forEach((item) => {
    item.addEventListener("click", function () {
      selecList(this);
    });
  });

  function selecList(element) {
    let $item = document.querySelector(".list-item.active");
    if(element){
      $item.classList.remove("active");
      element.classList.add("active");
      showMessage();
      activeMessage(element);
    } else { 
      showMessage();
      activeMessage($item);
    }    
  }
  selecList()
})();
