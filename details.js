const id = new URLSearchParams(window.location.search).get('id');
const CASE_URL = 'https://fnd22-shared.azurewebsites.net/api/Cases/';
const COMMENT_URL = 'https://fnd22-shared.azurewebsites.net/api/Comments';
const wrapper = document.querySelector('.container_details');
const form = document.querySelector('.userInput');
const inline = document.querySelector('.inline');
const time_add = document.querySelector('.time_add');
const finished = document.querySelector('#green_btn');
const ongoing = document.querySelector('#orange_btn');
const notStarted = document.querySelector('#red_btn');

const comments = [];
let newComment = {};
let newStatus = {};
let caseId = null;

finished.addEventListener('click', (e) => {
  if (caseId) {
    putStatus(caseId, 3);
  }
});

ongoing.addEventListener('click', (e) => {
  if (caseId) {
    putStatus(caseId, 2);
  }
});

notStarted.addEventListener('click', (e) => {
  if (caseId) {
    putStatus(caseId, 1);
  }
});

form.addEventListener('submit', (e) => {
  newComment = {
    caseId: id,
    email: document.querySelector('.emailInput').value,
    message: document.querySelector('.messageInput').value,
  };
  
  console.log(JSON.stringify(newComment));
  document.querySelector('.emailInput').value = ''
  document.querySelector('.messageInput').value = ''
  e.preventDefault();

  postComment();
});

// set case status with switch based on status id
const setStatus = (statusId) => {
  switch (statusId) {
    case 1:
      notStarted.checked = true;
      return;

    case 2:
      ongoing.checked = true;
      return;

    case 3:
      finished.checked = true;
      return;

    default:
      return;
  }
};

const getCase = () => {
  return fetch(CASE_URL + id)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      email = data.email;
      caseId = data.id;

      if (data.status) {
        setStatus(data.status.id);
      }

      time_add.innerText = data.created.replace('T', ' ').substring(0, 16);

      const card = document.querySelector('div');

      const subject = card.querySelector('h2');
      const _email = document.querySelector('.detailsEmail');
      const message = document.querySelector('.detailsMessage');
      subject.innerText = data.subject;
      _email.innerText = data.email;
      message.innerText = data.message;

      data.comments.forEach((element) => {
        comments.push(element);
      });
      comments.sort(function (a, b) {
        if (a.created > b.created) return -1;
        if (a.created < b.created) return 1;
        return 0;
      });
      console.log(comments);

      const commentList = document.querySelector('#commentList');

      console.log(data.comments.length);
      commentList.innerHTML = '';
      for (let i = 0; i < data.comments.length; i++) {
        const time_add = document.createElement('span');
        time_add.innerText = data.comments[i].created
          .replace('T', ' ')
          .substring(0, 16);
        commentList.appendChild(time_add);

        const email = document.createElement('span');
        email.innerText = comments[i].email;
        commentList.appendChild(email);

        const comment = document.createElement('textarea');
        comment.innerText = comments[i].message;
        comment.readOnly = true;
        commentList.appendChild(comment);
      }

      return data;
    });
};

const postComment = () => {
  return fetch(COMMENT_URL, {
    method: 'POST',
    body: JSON.stringify(newComment),
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
  })
    .then((res) => {
      console.log(res);
      getCase();
    })
    .catch((err) => console.log(err));
};

const putStatus = (id, statusId) => {
  return fetch(CASE_URL + id, {
    method: 'PUT',
    body: JSON.stringify({
      id: id,
      statusId: statusId,
    }),
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
  })
    .then((res) => {
      console.log(res);
      getCase();
    })
    .catch((err) => console.log(err));
};

getCase();
