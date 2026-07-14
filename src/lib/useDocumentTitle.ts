import { useEffect } from 'react'

/**
 * Задава document.title за текущата страница и го връща към предишния при
 * напускане. Полезно за SPA маршрути, където index.html има само едно заглавие.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
