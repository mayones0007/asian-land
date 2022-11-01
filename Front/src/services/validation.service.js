export const validation = (value, type) => {
  const letters = /[A-z]/
  const numbers = /[0-9]/
  if(value) {
    switch (type) {
      case 'phone':
        return value.length > 11 && value.match(numbers) && value.includes('+') ? '' : 'Введите корректный phone'
      case 'email':
        return value.includes('@') && value.includes('.') ? '' : 'Введите корректный email'
      case 'password':
        return value.length > 6 && value.match(numbers) && value.match(letters) ? '' : 'Пароль должен быть больше 6 символов и включать латниские буквы и цифры'
      case 'firstName':
        return value.length > 1 && value.match(letters) ? '' : 'Введите корректное имя'
      case 'lastName':
        return value.length > 1 && value.match(letters) ? '' : 'Введите корректную фамилию'
      default:
        return ''
    }
  } return 'заполни поле'
}