import {createIpcClient} from '/@/ipc';


export function showErrorMessage({title = 'Ошибка', message = 'Неизвестная ошибка'}: {title: string, message: string}): Promise<void> {
  const dialog = createIpcClient('DialogsControllers');
  return dialog.showError(title, message);
}

