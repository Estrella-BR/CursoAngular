import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoanService } from '../loan';
import { Loan } from '../model/Loan';
import { ClientService } from '../../client/client';
import { Client } from '../../client/model/Client';
import { GameService } from '../../game/game';
import { Game } from '../../game/model/Game';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-loan-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule ],
    templateUrl: './loan-edit.html',
    styleUrl: './loan-edit.scss',
})
export class LoanEditComponent implements OnInit {
    loan: Loan = new Loan();
    clients: Client[] = [];
    games: Game[] = [];
    errorMessage: string = '';
    serverErrorMessage: string = '';

    constructor(
        public dialogRef: MatDialogRef<LoanEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loanService: LoanService,
        private clientService: ClientService,
        private gameService: GameService
    ) {}

    ngOnInit(): void {
        this.loan = this.data?.Loan ? Object.assign({}, this.data.Loan) : new Loan();

        this.clientService.getClients().subscribe((clients) => {
            this.clients = clients;

            if (this.loan.client != null) {
                const clientFilter: Client[] = clients.filter(
                    (client) => client.id == this.loan.client.id
                );
                if (clientFilter.length > 0) {
                    this.loan.client = clientFilter[0];
                }
            }
        });

        this.gameService.getGames().subscribe((games) => {
            this.games = games;

            if (this.loan.game != null) {
                const gameFilter: Game[] = games.filter(
                    (game) => game.id == this.loan.game.id
                );
                if (gameFilter.length > 0) {
                    this.loan.game = gameFilter[0];
                }
            }
        });
    }

    onSave() {
        this.errorMessage = '';
        this.serverErrorMessage = '';
        if (this.isEndDateBeforeBeginDate()) {
            this.errorMessage = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
            return;
        }

        this.loanService.saveLoan(this.loan).subscribe({
            next: () => {
                this.dialogRef.close();
            },
            error: (error) => {
                this.serverErrorMessage = 'Error al guardar el préstamo. Comprueba que los datos sean correctos.';
                console.error('Error saving loan:', error);
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    private parseDate(value: Date | string | undefined | null): Date | null {
        if (value == null || value === '') {
            return null;
        }
        const date = value instanceof Date ? value : new Date(value);
        return isNaN(date.getTime()) ? null : date;
    }

    private isEndDateBeforeBeginDate(): boolean {
        const begin = this.parseDate(this.loan.beginDate);
        const end = this.parseDate(this.loan.endDate);
        return begin !== null && end !== null && end < begin;
    }
}
