export const numWord = (value, words) => {
  if (value > 1) {return value + " " + words[1]}
  else { return value + " " + words[0] }
}