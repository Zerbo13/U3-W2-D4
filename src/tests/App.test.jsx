import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import books from '../data/fantasy.json'

describe('Test completi per Been Library App', () => {
  // 1️⃣ Welcome
  test('Welcome viene montato correttamente', () => {
    render(<App />)
    expect(screen.getByText(/welcome/i)).toBeInTheDocument()
  })

  // 2️⃣ Numero di card corretto
  test('Sono renderizzate tante card quanti sono i libri nel JSON', () => {
    render(<App />)
    const cards = screen.getAllByTestId('book-card')
    expect(cards.length).toBe(books.length)
  })

  // 3️⃣ CommentArea montato
  test('CommentArea viene renderizzato correttamente', () => {
    render(<App />)
    expect(screen.getByTestId('comment-area')).toBeInTheDocument()
  })

  // 4️⃣ Filtraggio navbar
  test('Il filtraggio dei libri tramite navbar funziona come previsto', () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/cerca/i)
    fireEvent.change(input, { target: { value: 'harry' } })

    const results = screen.getAllByTestId('book-card')
    expect(results.every(card =>
      card.textContent.toLowerCase().includes('harry')
    )).toBe(true)
  })

  // 5️⃣ Clic → selezione bordo
  test('Cliccando su un libro, il suo bordo cambia colore (classe selected)', () => {
    render(<App />)

    const first = screen.getAllByTestId('book-card')[0]
    fireEvent.click(first)

    expect(first).toHaveClass('selected')
  })

  // 6️⃣ Clic su secondo libro → il primo torna normale
  test('Clic su un secondo libro resetta la selezione del primo', () => {
    render(<App />)

    const [first, second] = screen.getAllByTestId('book-card')

    fireEvent.click(first)
    fireEvent.click(second)

    expect(first).not.toHaveClass('selected')
    expect(second).toHaveClass('selected')
  })

  // 7️⃣ All’avvio non devono esistere SingleComment
  test('All’avvio della pagina non ci sono SingleComment nel DOM', () => {
    render(<App />)
    const comments = screen.queryAllByTestId('single-comment')
    expect(comments.length).toBe(0)
  })

  // 8️⃣ Clic su libro → recensioni caricate (se presenti)
  test('Cliccando su un libro con recensioni, esse vengono caricate nel DOM', async () => {
    render(<App />)

    const first = screen.getAllByTestId('book-card')[0]
    fireEvent.click(first)

    const comments = await screen.findAllByTestId('single-comment')
    expect(comments.length).toBeGreaterThan(0)
  })
})
