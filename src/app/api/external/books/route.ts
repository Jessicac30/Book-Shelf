import { NextResponse } from "next/server";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
const OPENLIB_SEARCH_API = "https://openlibrary.org/search.json";

function mapGoogleItemToDto(item: any) {
  const v = item?.volumeInfo ?? {};
  const identifiers = Array.isArray(v.industryIdentifiers) ? v.industryIdentifiers : [];
  const isbn13 = identifiers.find((i: any) => i.type === 'ISBN_13')?.identifier;
  const isbn10 = identifiers.find((i: any) => i.type === 'ISBN_10')?.identifier;
  return {
    id: item.id,
    title: v.title ?? "",
    author: Array.isArray(v.authors) && v.authors.length ? v.authors[0] : "",
    pages: v.pageCount ?? undefined,
    synopsis: v.description ?? undefined,
    cover: v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail ?? undefined,
    isbn: isbn13 ?? isbn10 ?? undefined,
    publishedYear: v.publishedDate ? Number(String(v.publishedDate).slice(0, 4)) : undefined,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('query') ?? '').trim();
  const maxResults = Math.min(Number(searchParams.get('limit') ?? '8'), 20);

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = new URL(GOOGLE_BOOKS_API);
  url.searchParams.set('q', query);
  url.searchParams.set('maxResults', String(maxResults));
  if (apiKey) url.searchParams.set('key', apiKey);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    let items: any[] = [];
    if (res.ok) {
      const data = await res.json().catch(() => ({ items: [] }));
      items = Array.isArray(data.items) ? data.items.map(mapGoogleItemToDto) : [];
    }
    // Fallback para OpenLibrary se vazio
    if (!items.length) {
      const ol = new URL(OPENLIB_SEARCH_API);
      ol.searchParams.set('q', query);
      ol.searchParams.set('limit', String(maxResults));
      const olRes = await fetch(ol.toString(), { next: { revalidate: 60 } });
      if (olRes.ok) {
        const data = await olRes.json().catch(() => ({ docs: [] }));
        const docs: any[] = Array.isArray(data.docs) ? data.docs : [];
        items = docs.map((d) => ({
          id: d.key ?? `${d.key}-${d.cover_i ?? ''}`,
          title: d.title ?? '',
          author: Array.isArray(d.author_name) && d.author_name.length ? d.author_name[0] : '',
          pages: d.number_of_pages_median ?? undefined,
          synopsis: undefined,
          cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : undefined,
          isbn: Array.isArray(d.isbn) && d.isbn.length ? d.isbn[0] : undefined,
          publishedYear: d.first_publish_year ?? undefined,
        }));
      }
    }
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ items: [] });
  }
}


