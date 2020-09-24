/***
 *  user api https://randomuser.me/api/ for list users
 ***/

(async function load() {
  const size = 768;
  async function getData(profile = false) {
    const response = await fetch(`https://randomuser.me/api/?results=10`);
    const { results } = await response.json();
    if (profile) {
      return results[0];
    }
    return results ? results : null;
  }

  /* load messages */
  const get_messages = async () => {
    const response = await fetch("./data.json");
    const data = await response.json();
    return data;
  };
  let $messages = document.querySelector(".message-body");
  function scroll() {    
    $messages.scrollTop = $messages.scrollHeight;
    window.scrollTo(0, $messages.scrollHeight);
  }
  let content_messages = document.querySelector(".message-content");

  async function load_messages(avatar) {
    const res = await get_messages();
    content_messages.innerHTML = "";
    res.map((item, index) => {
      let element = `
      <div class="message-item ${item.type}">
          <div class="avatar">
              <img height="30" src="${
                item.type == "sent" ? avatar : item.avatar
              }" />
          </div>
          <div class="content">
              <span> ${item.date} </span>
              <p> ${item.message} </p>
          </div>
      </div>`;

      content_messages.append(CreateTemplate(element));
    });
    scroll();
  }
  if (content_messages) {
    load_messages();
  }

  function CreateTemplate(htmlString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = htmlString;
    return html.body.children[0];
  }

  function template_list_user(id, name, picture, index) {
    return `<div class="list-item ${
      index == 0 ? " active" : ""
    }" data-id="${id}">
      <div class="avatar">
        ${index < 3 ? '<span class="active"></span>' : ""}        
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
      const { login, name, picture } = element;
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

  const activeMessage = (element) => {
    let img = element.querySelector(".avatar>img").src;
    let name = element.querySelector(".info>strong").textContent;
    let status = element.querySelector(".avatar>span");
    load_messages(img);

    document.querySelector(".message-info>.avatar>img").src = img;
    document.querySelector(".message-info>.info>span").textContent = name;
    if (status != null) {
      document.querySelector(".message-info>.info>small").textContent = name;
    } else {
      document.querySelector(".message-info>.info>small").remove();
    }
  };

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
    if (element) {
      $item.classList.remove("active");
      element.classList.add("active");
      showMessage();
      activeMessage(element);
    } else {
      showMessage();
      activeMessage($item);
    }
  }
  selecList();
  function get_time() {
    let t = new Date();
    let h = t.getHours();
    let min = t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes();
    min = (h<12)? min + " am": min+" pm";    
    return h +":"+min;
  }
  // add new messages
  function new_message(img, message) {
    let element = `
      <div class="message-item received">
          <div class="avatar">
              <img height="30" src="${img}" />
          </div>
          <div class="content">
              <span> ${get_time()} </span>
              <p> ${message} </p>
          </div>
      </div>`;
    return CreateTemplate(element);
  }
  let input_message = document.querySelector("input#emojis");
  let btn_send = document.getElementById("btn-send");
  let profile_avatar = document.querySelector("#user-info>.avatar>img").src;
  btn_send.addEventListener("click", function () {
    add_message();
  });
  function add_message() {
    content_messages.append(new_message(profile_avatar, input_message.value));
    input_message.value = "";    
    let emojis_editor = document.querySelector(".emojionearea-editor")
    emojis_editor.innerHTML=''
    scroll();
  }
})();
