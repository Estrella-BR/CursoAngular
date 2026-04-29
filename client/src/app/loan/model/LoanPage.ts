import { Pageable } from './../../core/model/page/Pageable';
import { Loan } from "./Loan";

export class LoanPage {
    content: Loan[] = new Array<Loan>();
    pageable: Pageable = new Pageable();
    totalElements: number = 0;
}
