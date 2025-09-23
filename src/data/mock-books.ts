import { Book } from '@/types/book'

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    genre: 'Literatura Brasileira',
    year: 1899,
    pages: 208,
    currentPage: 208,
    status: 'LIDO',
    cover: 'https://m.media-amazon.com/images/I/51rF8YXZPPL._SY445_SX342_.jpg',
    rating: 5,
    synopsis: 'Romance narrado em primeira pessoa por Bento Santiago, que relata sua suspeita de que sua esposa Capitu o traiu com seu melhor amigo, Escobar. A obra é considerada uma das maiores da literatura brasileira.',
    notes: 'Um clássico imperdível da literatura brasileira.'
  },
  {
    id: '2',
    title: 'Neuromancer',
    author: 'William Gibson',
    genre: 'Ficção Científica',
    year: 1984,
    pages: 271,
    currentPage: 150,
    status: 'LENDO',
    cover: 'https://m.media-amazon.com/images/I/41V5I3cGaQL._SY445_SX342_.jpg',
    rating: 4,
    synopsis: 'Case era o mais esperto ladrão de dados do Sprawl, até que cruzou os patrões errados. Agora tem uma última chance de redenção em um trabalho impossível no ciberespaço.',
    notes: 'Pioneiro do cyberpunk, muito influente.'
  },
  {
    id: '3',
    title: 'Cem Anos de Solidão',
    author: 'Gabriel García Márquez',
    genre: 'Realismo Mágico',
    year: 1967,
    pages: 417,
    status: 'QUERO_LER',
    cover: 'https://m.media-amazon.com/images/I/51P1YqyHX-L._SY445_SX342_.jpg',
    rating: 0,
    synopsis: 'A história da família Buendía ao longo de sete gerações na cidade fictícia de Macondo, uma obra-prima do realismo mágico.',
    notes: 'Recomendado por vários amigos.'
  },
  {
    id: '4',
    title: 'O Nome do Vento',
    author: 'Patrick Rothfuss',
    genre: 'Fantasia',
    year: 2007,
    pages: 662,
    currentPage: 662,
    status: 'LIDO',
    cover: 'https://m.media-amazon.com/images/I/51+FH+PfTXL._SY445_SX342_.jpg',
    rating: 5,
    synopsis: 'Kvothe conta sua própria história - como um jovem prodígio se tornou o mais notório mago, assassino, músico e herói de sua época.',
    notes: 'Fantasia épica incrível, aguardando ansiosamente o terceiro livro.'
  },
  {
    id: '5',
    title: 'Sapiens: Uma Breve História da Humanidade',
    author: 'Yuval Noah Harari',
    genre: 'História',
    year: 2011,
    pages: 443,
    currentPage: 200,
    status: 'PAUSADO',
    cover: 'https://m.media-amazon.com/images/I/413XTVUDAXL._SY445_SX342_.jpg',
    rating: 4,
    synopsis: 'Como o Homo sapiens conseguiu dominar a Terra? Harari examina como nos organizamos em cidades, reinos e impérios.',
    notes: 'Muito interessante, mas denso. Voltarei a ler em breve.'
  },
  {
    id: '6',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Programação',
    year: 2008,
    pages: 464,
    currentPage: 464,
    status: 'LIDO',
    cover: 'https://m.media-amazon.com/images/I/41jEbK-jG+L._SY445_SX342_.jpg',
    rating: 5,
    synopsis: 'Um manual sobre como escrever código limpo, legível e maintível. Essential para todo programador.',
    notes: 'Referência obrigatória. Devo reler periodicamente.'
  }
]