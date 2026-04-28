import { Author } from "../../author/model/Author";
import { Category } from "../../category/model/Category";

export class Game {
    id: number = 0;
    title: string = '';
    age: number = 0;
    category: Category = new Category();
    author: Author = new Author();
}
