export interface CODE_OBJECT {
  html?:  {
    value: '',
    options: []
  },
  css?:  {
    value: '',
    options: []
  },
  javascript?:  {
    value: '',
    options: []
  }
}

export type SUPPORTED_LANGUAGES = keyof CODE_OBJECT;

export interface APP_SETTINGS {
  color_scheme: 'light',
  direction: 'ltr' | 'rtl';
  editors: {
    html: {
      collapsed: boolean
    }
  }
}
