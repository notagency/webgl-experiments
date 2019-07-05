export default class Menu {

  constructor(app, data) {
    const [type, items] = Object.entries(data)[0];
    this.app = app;
    this.type = type;
    this.items = items;
    this.render()
  }

  render() {
    const title = document.createElement('h2');
    title.innerText = this.type;
    document.getElementById(this.type).appendChild(title);
    for (let [className, Scene] of Object.entries(this.items)) {
      const button = document.createElement('button');
      button.innerText = className;
      document.getElementById(this.type).appendChild(button);
      button.addEventListener('click', () => this.onClick(button, Scene));
    }
  }

  onClick(button, Scene) {
    this.highlightMenuButton(button);
    this.app.changeScene(Scene);
  }

  highlightMenuButton(button) {
    document.querySelectorAll('button')
      .forEach((button) =>
        button.classList.remove('selected')
      );
    button.classList.add('selected');
  }
}