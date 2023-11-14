import { AppModel } from './appModel'
import { DOMView } from './domView'

export class AppController {
  private model: AppModel
  private view: DOMView

  constructor(model: AppModel, view: DOMView) {
    this.model = model
    this.view = view

    // Подписываемся на события из представления
    this.view.onButtonClick(this.handleButtonClick.bind(this))
    this.view.onKeyDown(this.handleKeyDown.bind(this))
  }

  public startTraining(): void {
    this.model.setWords(this.view.getWords())
    this.model.setCurrentQuestion(1) // Установим начальный вопрос
    this.model.setQuestionsQuantity(6) // Установим общее количество вопросов в сессии
    this.model.initializeTraining()
    this.updateView()
  }

  private handleButtonClick(index: number): void {
    this.view.handleButtonClick(index)
    this.updateView()
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.view.handleKeyDown(event)
  }

  private updateView(): void {
    const currentWord = this.model.getCurrentWord()
    const correctWords = this.model.getCorrectWords()

    this.view.render({
      currentWord,
      correctWords,
    })
  }
}
