import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Loan } from './model/Loan';
import { LoanPage } from './model/LoanPage';
import { HttpClient } from '@angular/common/http';
import { Client } from '../client/model/Client';
import { Game } from '../game/model/Game';


@Injectable({
    providedIn: 'root',
})
export class LoanService {
    constructor(private http: HttpClient) {}

     private baseUrl = 'http://localhost:8080/loan';

    getLoans(pageable: Pageable, client?: Client, game?: Game, date?: Date): Observable<LoanPage> {
        let params = new URLSearchParams();

        if (client?.id) {
            params.set('idClient', client.id.toString());
        }

        if (game?.id) {
            params.set('idGame', game.id.toString());
        }

        if (date) {
          const fecha = new Date(date)
            params.set('date', fecha.toISOString());
        }

        // Agregar parámetros de paginación
        params.set('page', pageable.pageNumber?.toString() || '0');
        params.set('size', pageable.pageSize?.toString() || '20');
        if (pageable.sort && pageable.sort.length > 0) {
            const sortParams = pageable.sort.map(s => `${s.property},${s.direction}`).join('&sort=');
            params.set('sort', sortParams);
        }

        const queryString = params.toString();
        const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

        return this.http.get<LoanPage>(url);
    }

    saveLoan(loan: Loan): Observable<Loan> {
        const { id } = loan;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Loan>(url, loan);
    }

    deleteLoan(idLoan: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${idLoan}`);
    }

    getAllLoans(): Observable<Loan[]> {
        return this.http.get<Loan[]>(this.baseUrl);
    }
}
