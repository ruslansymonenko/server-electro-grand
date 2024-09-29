import slugify from 'slugify';

export function createSlug(name: string): string {
  return slugify(name, {
    lower: true,
    strict: true,
    locale: 'uk',
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
  });
}
