import { make } from './ui';
import bgIcon from './svg/background.svg';
import borderIcon from './svg/border.svg';
import stretchedIcon from './svg/stretched.svg';

/**
 * Working with Block Tunes
 */
export default class Tunes {
  /**
   * @param {object} tune - image tool Tunes managers
   * @param {object} tune.api - Editor API
   * @param {object} tune.actions - list of user defined tunes
   * @param {Function} tune.onChange - tune toggling callback
   */
  constructor({ api, actions, onChange }) {
    this.api = api;
    this.actions = actions;
    this.onChange = onChange;
    this.buttons = [];
  }

  /**
   * Available Image tunes
   *
   * @returns {{name: string, icon: string, title: string}[]}
   */
  static get tunes() {
    return [
      {
        name: 'markup',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.68333 17.1492C3.44956 17.1488 3.22672 17.0502 3.06916 16.8775C2.9087 16.7062 2.82896 16.4746 2.84999 16.2408L3.05416 13.9958L12.4858 4.5675L15.4333 7.51417L6.00416 16.9417L3.75916 17.1458C3.73333 17.1483 3.70749 17.1492 3.68333 17.1492ZM16.0217 6.925L13.075 3.97834L14.8425 2.21084C14.9988 2.05436 15.2109 1.96643 15.4321 1.96643C15.6533 1.96643 15.8654 2.05436 16.0217 2.21084L17.7892 3.97834C17.9456 4.13464 18.0336 4.34675 18.0336 4.56792C18.0336 4.78909 17.9456 5.0012 17.7892 5.1575L16.0225 6.92417L16.0217 6.925Z" fill="#2E3A59"/>
              </svg>`,
        title: 'markup',
      },
      {
        name: 'ocr',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18.3333H5.00004C4.07957 18.3333 3.33337 17.5871 3.33337 16.6666V3.3333C3.33337 2.41283 4.07957 1.66663 5.00004 1.66663H10.8334C11.0545 1.66585 11.2668 1.75381 11.4225 1.9108L16.4225 6.9108C16.5795 7.06658 16.6675 7.27881 16.6667 7.49996V16.6666C16.6667 17.5871 15.9205 18.3333 15 18.3333ZM5.00004 3.3333V16.6666H13.8217L11.6834 14.5283C11.1752 14.8347 10.5935 14.9977 10 15C8.46771 15.0166 7.11712 13.9972 6.71292 12.5191C6.30872 11.0409 6.95269 9.47615 8.28025 8.7107C9.6078 7.94525 11.2846 8.17185 12.3614 9.2622C13.4382 10.3526 13.6437 12.0321 12.8617 13.35L15 15.49V7.84497L10.4884 3.3333H5.00004ZM10 9.99997C9.07957 9.99997 8.33337 10.7462 8.33337 11.6666C8.33337 12.5871 9.07957 13.3333 10 13.3333C10.9205 13.3333 11.6667 12.5871 11.6667 11.6666C11.6667 10.7462 10.9205 9.99997 10 9.99997Z" fill="#2E3A59"/>
              </svg> `,
        title: 'ocr',
      },
      {
        name: 'play',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.99996 18.3333C5.39968 18.3283 1.67168 14.6003 1.66663 9.99997V9.83331C1.75824 5.25375 5.52878 1.6066 10.1089 1.66737C14.6889 1.72814 18.3614 5.47405 18.3314 10.0544C18.3015 14.6348 14.5804 18.3324 9.99996 18.3333ZM8.33329 6.24997V13.75L13.3333 9.99997L8.33329 6.24997Z" fill="#2E3A59"/>
              </svg>`,
        title: 'play',
        action: onclick => {
          console.log("onclickPlayButton");
        }
      },
    ];
  }

  /**
   * Styles
   *
   * @returns {{wrapper: string, buttonBase: *, button: string, buttonActive: *}}
   */
  get CSS() {
    return {
      wrapper: '',
      buttonBase: this.api.styles.settingsButton,
      button: 'image-tool__tune',
      buttonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * Makes buttons with tunes: add background, add border, stretch image
   *
   * @param {ImageToolData} toolData - generate Elements of tunes
   * @returns {Element}
   */
  render(toolData) {
    const wrapper = make('div', this.CSS.wrapper);

    this.buttons = [];

    const tunes = Tunes.tunes.concat(this.actions);

    tunes.forEach(tune => {
      const title = this.api.i18n.t(tune.title);
      const el = make('div', [this.CSS.buttonBase, this.CSS.button], {
        innerHTML: tune.icon,
        title,
      });

      el.addEventListener('click', () => {
        this.tuneClicked(tune.name, tune.action);
      });

      el.dataset.tune = tune.name;
      el.classList.toggle(this.CSS.buttonActive, toolData[tune.name]);

      this.buttons.push(el);

      this.api.tooltip.onHover(el, title, {
        placement: 'top',
      });

      wrapper.appendChild(el);
    });

    return wrapper;
  }

  /**
   * Clicks to one of the tunes
   *
   * @param {string} tuneName - clicked tune name
   * @param {Function} customFunction - function to execute on click
   */
  tuneClicked(tuneName, customFunction) {
    if (typeof customFunction === 'function') {
      if (!customFunction(tuneName)) {
        return false;
      }
    }

    const button = this.buttons.find(el => el.dataset.tune === tuneName);

    button.classList.toggle(this.CSS.buttonActive, !button.classList.contains(this.CSS.buttonActive));

    this.onChange(tuneName);
  }
}
