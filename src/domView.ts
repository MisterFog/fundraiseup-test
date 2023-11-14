import { AppModel } from './appModel'

export class DOMView {
  private model: AppModel

  constructor(model: AppModel) {
    this.model = model
  }

  public getWords(): string[] {
    return this.model.getWords()
  }

  public renderWord(callback?: () => void): void {
    const currentQuestionSpan = document.getElementById('current_question')!
    const totalQuestionsSpan = document.getElementById('total_questions')!
    const answerContainer = document.getElementById('answer')!

    currentQuestionSpan.textContent = this.model.getCurrentQuestion().toString()
    totalQuestionsSpan.textContent = this.model.getQuestionsQuantity().toString()
    answerContainer.textContent = ''

    for (let i = 0; i < this.model.getCorrectWords(); i++) {
      const span: HTMLSpanElement = document.createElement('span')
      span.textContent = this.model.getCurrentWord()[i]
      span.classList.add('btn', 'btn-success', 'm-1')
      answerContainer.appendChild(span)
    }

    // Добавим небольшую задержку перед вызовом callback
    setTimeout(callback, 100)
  }

  public renderButtons(): void {
    const lettersContainer = document.getElementById('letters')!
    lettersContainer.innerHTML = ''

    this.model.getShuffledWord().forEach((letter, index) => {
      const button: HTMLButtonElement = document.createElement('button')
      button.classList.add('btn', 'btn-primary', 'm-1')
      button.textContent = letter
      button.addEventListener('click', () => this.handleButtonClick(index))
      lettersContainer.appendChild(button)
    })
  }

  public handleButtonClick(index: number): void {
    const button: HTMLElement = document.getElementById('letters')!.children[index] as HTMLElement

    if (
      button &&
      this.model.getShuffledWord()[index] ===
        this.model.getCurrentWord()[this.model.getCorrectWords()]
    ) {
      const letterIndex: number = this.model
        .getShuffledWord()
        .indexOf(this.model.getCurrentWord()[this.model.getCorrectWords()])

      if (letterIndex !== -1) {
        this.model.getShuffledWord().splice(letterIndex, 1)
      }

      this.model.setCorrectWords(this.model.getCorrectWords() + 1)

      this.renderWord(() => {
        if (this.model.getCorrectWords() === this.model.getCurrentWord().length) {
          this.endTraining()
        }
      })
      this.renderButtons()
    } else {
      this.model.setErrors(this.model.getErrors() + 1)

      if (button) {
        button.classList.add('incorrect')
      }

      this.model.getCurrentWords()[this.model.getCurrentWord()] = this.model.getErrors()

      setTimeout(() => {
        if (button) {
          button.classList.remove('incorrect')
        }
      }, 500)

      if (this.model.getErrors() >= this.model.getMaxErrors()) {
        const lettersContainer = document.getElementById('letters')!
        lettersContainer.innerHTML = ''

        this.model
          .getCurrentWord()
          .split('')
          .forEach((letter, index) => {
            const button: HTMLButtonElement = document.createElement('button')
            button.classList.add('btn', 'btn-danger', 'm-1')
            button.textContent = letter
            lettersContainer.appendChild(button)
          })

        setTimeout(() => {
          this.endTraining()
        }, 1000)
      }
    }
  }

  public handleKeyDown(event: KeyboardEvent): void {
    const pressedKey: string = event.key.toLowerCase()

    if (/^[a-z]$/.test(pressedKey) && this.model.getShuffledWord().includes(pressedKey)) {
      const index: number = this.model.getShuffledWord().indexOf(pressedKey)
      const lettersContainer = document.getElementById('letters')!
      const button: HTMLElement | null = lettersContainer.children[index] as HTMLElement | null

      if (
        button &&
        this.model.getShuffledWord()[index] ===
          this.model.getCurrentWord()[this.model.getCorrectWords()]
      ) {
        this.model.getShuffledWord().splice(index, 1)
        this.model.setCorrectWords(this.model.getCorrectWords() + 1)

        this.renderWord(() => {
          if (this.model.getCorrectWords() === this.model.getCurrentWord().length) {
            this.endTraining()
          }
        })
        this.renderButtons()
      } else {
        this.model.setErrors(this.model.getErrors() + 1)

        if (button) {
          button.classList.add('incorrect')
        }

        this.model.getCurrentWords()[this.model.getCurrentWord()] = this.model.getErrors()

        setTimeout(() => {
          if (button) {
            button.classList.remove('incorrect')
          }
        }, 500)

        if (this.model.getErrors() >= this.model.getMaxErrors()) {
          const lettersContainer = document.getElementById('letters')!
          lettersContainer.innerHTML = ''

          this.model
            .getCurrentWord()
            .split('')
            .forEach((letter, index) => {
              const button: HTMLButtonElement = document.createElement('button')
              button.classList.add('btn', 'btn-danger', 'm-1')
              button.textContent = letter
              lettersContainer.appendChild(button)
            })

          setTimeout(() => {
            this.endTraining()
          }, 1000)
        }
      }
    } else {
      this.model.setErrors(this.model.getErrors() + 1)
      this.model.getCurrentWords()[this.model.getCurrentWord()] = this.model.getErrors()
    }

    if (this.model.getErrors() >= this.model.getMaxErrors()) {
      const lettersContainer = document.getElementById('letters')!
      lettersContainer.innerHTML = ''

      this.model
        .getCurrentWord()
        .split('')
        .forEach((letter, index) => {
          const button: HTMLButtonElement = document.createElement('button')
          button.classList.add('btn', 'btn-danger', 'm-1')
          button.textContent = letter
          lettersContainer.appendChild(button)
        })

      setTimeout(() => {
        this.endTraining()
      }, 1000)
    }
  }

  public startTraining(): void {
    this.model.setCurrentWord(this.getRandomWordWithoutRepeats())
    this.model.getCurrentWords()[this.model.getCurrentWord()] = 0
    this.model.setShuffledWord(this.shuffleWord(this.model.getCurrentWord()))
    this.model.setErrors(0)

    this.renderWord()
    this.renderButtons()
  }

  public endTraining(): void {
    this.model.setCorrectWords(0)
    this.model.setCurrentQuestion(this.model.getCurrentQuestion() + 1)

    if (this.model.getCurrentQuestion() <= this.model.getQuestionsQuantity()) {
      this.startTraining()
    } else {
      const result = this.getStatistic()

      alert(`Training completed!
          Total Correct Words: ${result.wordsWithoutErrorsCount}
          Total Errors: ${result.totalErrorsInSession}
          Word(s) with Most Errors: ${result.wordsWithMostErrors}`)
    }
  }

  public getStatistic(): {
    wordsWithMostErrors: string
    wordsWithoutErrorsCount: number
    totalErrorsInSession: number
  } {
    let maxErrorsCount: number = 0
    let wordsWithMostErrors: string[] = []
    let totalErrorsInSession: number = 0

    for (const key in this.model.getCurrentWords()) {
      const errorsCount: number = this.model.getCurrentWords()[key]

      if (errorsCount > 0) {
        if (errorsCount > maxErrorsCount) {
          maxErrorsCount = errorsCount
          wordsWithMostErrors = [key]
        } else if (errorsCount === maxErrorsCount) {
          wordsWithMostErrors.push(key)
        }
      }

      if (this.model.getCurrentWords().hasOwnProperty(key)) {
        totalErrorsInSession += this.model.getCurrentWords()[key]
      }
    }

    return {
      wordsWithMostErrors: maxErrorsCount === 0 ? '0' : wordsWithMostErrors.join(', '),
      wordsWithoutErrorsCount: this.countWordsWithoutErrors(),
      totalErrorsInSession,
    }
  }

  public countWordsWithoutErrors(): number {
    let wordsWithoutErrorsCount: number = 0

    for (const key in this.model.getCurrentWords()) {
      if (this.model.getCurrentWords()[key] === 0) {
        wordsWithoutErrorsCount++
      }
    }

    return wordsWithoutErrorsCount
  }

  private getRandomWordWithoutRepeats(): string {
    if (this.model.getShuffledWords().length === 0) {
      this.model.setShuffledWords([...this.model.getWords()])
    }

    const randomIndex: number = Math.floor(Math.random() * this.model.getShuffledWords().length)
    const selectedWord: string = this.model.getShuffledWords()[randomIndex]

    this.model.getShuffledWords().splice(randomIndex, 1)

    return selectedWord
  }

  private shuffleWord(word: string): string[] {
    return word.split('').sort(() => Math.random() - 0.5)
  }

  private style(): void {
    const style: HTMLStyleElement = document.createElement('style')
    style.innerHTML = `
        .btn-primary.incorrect:hover {
            background-color: red;
        }
        .btn-primary.incorrect {
            background-color: red;
        }
    `
    document.head.appendChild(style)
  }

  public onButtonClick(callback: (index: number) => void): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement

      if (target?.classList.contains('btn-primary')) {
        const buttonContainer = target.closest('.button-container')

        if (buttonContainer) {
          const index = Array.from(buttonContainer.children).indexOf(target)
          callback(index)
        }
      }
    })
  }

  public onKeyDown(callback: (event: KeyboardEvent) => void): void {
    document.addEventListener('keydown', (event) => {
      callback(event)
    })
  }

  public showStatistics(result: {
    wordsWithMostErrors: string
    wordsWithoutErrorsCount: number
    totalErrorsInSession: number
  }): void {
    alert(`Training completed!
        Total Correct Words: ${result.wordsWithoutErrorsCount}
        Total Errors: ${result.totalErrorsInSession}
        Word(s) with Most Errors: ${result.wordsWithMostErrors}`)
  }

  public start(): void {
    document.addEventListener('DOMContentLoaded', () => this.startTraining())
    this.style()
  }

  public render({
    currentWord,
    correctWords,
  }: {
    currentWord: string
    correctWords: number
  }): void {
    this.renderWord(() => {
      if (correctWords === currentWord.length) {
        this.endTraining()
      }
    })
    this.renderButtons()
  }
}
