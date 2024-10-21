export interface CODE_OBJECT {
  html?: string,
  css?: string,
  javascript?: string
}
export type SUPPORTED_LANGUAGES = keyof CODE_OBJECT;

export interface APP_SETTINGS {
  editor: {
    direction: 'ltr' | 'rtl';
    html: {
      collapsed: boolean
    }
  }
}
