import { async } from "regenerator-runtime";

const form = document.getElementById("comment_form");
const videoContainer = document.getElementById("videoContainer");
const removeBtn = document.querySelectorAll(".video_comments ul li");

const addFakeComment = (text, id) => {
  const commentsUl = document.querySelector(".video_comments ul");
  const newCommentLi = document.createElement("li");
  const newCommentSpan = document.createElement("span");
  const xBtn = document.createElement("button");
  xBtn.innerText = "❌";
  newCommentSpan.innerText = ` ${text}`;
  newCommentSpan.className = "video_comment";
  newCommentLi.dataset.id = id;
  newCommentLi.appendChild(newCommentSpan);
  newCommentLi.appendChild(xBtn);
  commentsUl.prepend(newCommentLi);
  xBtn.addEventListener("click", removeComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  textarea.value = "";
  if (response.status == 201) {
    const { newCommentId } = await response.json();
    addFakeComment(text, newCommentId);
  }
};

const removeComment = async (event) => {
  const commentId = event.target.parentElement.dataset.id;
  const videoId = videoContainer.dataset.id;
  const response = await fetch(`/api/${commentId}/remove`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commentId,
      videoId,
    }),
  });
  if (response.status == 200) {
    const { removedCommentId } = await response.json();
    if (removedCommentId == commentId) {
      const cut = document.querySelectorAll(".video_comments ul li");
      cut.forEach((t) => {
        if (t.dataset.id == removedCommentId) {
          t.remove();
        }
      });
    }
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

removeBtn.forEach((btn) => {
  btn.addEventListener("click", removeComment);
});
