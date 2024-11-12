const generateObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomBytes = Array.from({ length: 5 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
  const increment = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  return timestamp + randomBytes + increment;
}

export default generateObjectId;
