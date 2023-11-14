export class AppModel {
  // Список слов для тренировки
  private words: string[]

  // Текущее слово и статистика ошибок для каждого слова
  private currentWord: string
  private currentWords: Record<string, number>

  // Массив перемешанных слов для текущей сессии
  private shuffledWords: string[]

  // Массив перемешанных букв текущего слова
  private shuffledWord: string[]

  // Количество ошибок и максимальное количество ошибок для одного слова
  private errors: number
  private maxErrors: number

  // Количество правильно введенных букв текущего слова
  private correctWords: number

  // Текущий вопрос и общее количество вопросов в сессии
  private currentQuestion: number
  private questionsQuantity: number

  // Конструктор класса
  constructor() {
    this.words = [
      'apple',
      'function',
      'timeout',
      'task',
      'application',
      'data',
      'tragedy',
      'sun',
      'symbol',
      'button',
      'software',
    ]
    this.currentWord = ''
    this.currentWords = {}
    this.shuffledWords = []
    this.shuffledWord = []
    this.errors = 0
    this.maxErrors = 3
    this.correctWords = 0
    this.currentQuestion = 1
    this.questionsQuantity = 2
  }

  // Получение списка слов для тренировки
  public getWords(): string[] {
    return this.words
  }

  // Установка нового списка слов
  public setWords(words: string[]): void {
    this.words = words
  }

  // Получение текущего слова
  public getCurrentWord(): string {
    return this.currentWord
  }

  // Установка нового текущего слова
  public setCurrentWord(word: string): void {
    this.currentWord = word
  }

  // Получение статистики ошибок для каждого слова
  public getCurrentWords(): Record<string, number> {
    return this.currentWords
  }

  // Установка новой статистики ошибок
  public setCurrentWords(words: Record<string, number>): void {
    this.currentWords = words
  }

  // Получение списка перемешанных слов
  public getShuffledWords(): string[] {
    return this.shuffledWords
  }

  // Установка нового списка перемешанных слов
  public setShuffledWords(words: string[]): void {
    this.shuffledWords = words
  }

  // Получение текущей перемешанной буквы слова
  public getShuffledWord(): string[] {
    return this.shuffledWord
  }

  // Установка новой перемешанной буквы слова
  public setShuffledWord(word: string[]): void {
    this.shuffledWord = word
  }

  // Получение количества ошибок
  public getErrors(): number {
    return this.errors
  }

  // Установка нового количества ошибок
  public setErrors(errors: number): void {
    this.errors = errors
  }

  // Получение максимального количества ошибок для одного слова
  public getMaxErrors(): number {
    return this.maxErrors
  }

  // Получение количества правильно введенных букв текущего слова
  public getCorrectWords(): number {
    return this.correctWords
  }

  // Установка нового количества правильно введенных букв текущего слова
  public setCorrectWords(count: number): void {
    this.correctWords = count
  }

  // Получение номера текущего вопроса
  public getCurrentQuestion(): number {
    return this.currentQuestion
  }

  // Установка нового номера текущего вопроса
  public setCurrentQuestion(question: number): void {
    this.currentQuestion = question
  }

  // Получение общего количества вопросов в сессии
  public getQuestionsQuantity(): number {
    return this.questionsQuantity
  }

  // Установка нового общего количества вопросов в сессии
  public setQuestionsQuantity(quantity: number): void {
    this.questionsQuantity = quantity
  }

  // Выбор случайного слова без повторов
  public getRandomWordWithoutRepeats(): string {
    if (this.getShuffledWords().length === 0) {
      this.setShuffledWords([...this.getWords()])
    }

    const randomIndex: number = Math.floor(Math.random() * this.getShuffledWords().length)
    const selectedWord: string = this.getShuffledWords()[randomIndex]

    this.getShuffledWords().splice(randomIndex, 1)

    return selectedWord
  }

  // Инициализация сессии тренировки
  public initializeTraining(): void {
    this.setCurrentWord(this.getRandomWordWithoutRepeats())
    this.getCurrentWords()[this.getCurrentWord()] = 0
  }
}
