export const inputNameElement = () => {
  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.style.fontSize = "32px";
  inputElement.placeholder = "닉네임을 입력해주세요.";

  return inputElement;
};
