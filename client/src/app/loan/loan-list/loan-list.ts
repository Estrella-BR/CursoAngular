import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Loan } from '../model/Loan';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoanEditComponent } from '../loan-edit/loan-edit';
import { LoanService } from '../loan';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/Game';
import { ClientService } from '../../client/client';
import { GameService } from '../../game/game';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';


@Component({
    selector: 'app-loan-list',
    standalone: true,
    imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,

],
    templateUrl: './loan-list.html',
    styleUrls: ['./loan-list.scss'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
})
export class LoanListComponent implements OnInit {
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;

    loans: Loan[] = [];
    clients: Client[] = [];
    games: Game[] = [];
    filterClient: Client = new Client();
    filterGame: Game = new Game();
    filterDate?: Date;

    dataSource = new MatTableDataSource<Loan>();
    displayedColumns: string[] = ['id', 'beginDate', 'endDate', 'game', 'client', 'action'];

    constructor(private loanService: LoanService, public dialog: MatDialog, private clientService: ClientService, private gameService: GameService) {}

    ngOnInit(): void {
        this.loadPage();

        this.clientService
            .getClients()
            .subscribe((clients) => (this.clients = clients));

        this.gameService
            .getGames()
            .subscribe((games) => (this.games = games));
    }

    loadPage(event?: PageEvent) {
        const pageable: Pageable = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
        };

        if (event != null) {
            pageable.pageSize = event.pageSize;
            pageable.pageNumber = event.pageIndex;
        }

        const client = this.filterClient.id ? this.filterClient : undefined;
        const game = this.filterGame.id ? this.filterGame : undefined;

        this.loanService.getLoans(pageable, client, game, this.filterDate).subscribe((data) => {
            this.dataSource.data = data.content;
            this.pageNumber = data.pageable.pageNumber;
            this.pageSize = data.pageable.pageSize;
            this.totalElements = data.totalElements;
        });
    }

    createLoan() {
        const dialogRef = this.dialog.open(LoanEditComponent, {
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.ngOnInit();
        });
    }

    editLoan(loan: Loan) {
        const dialogRef = this.dialog.open(LoanEditComponent, {
            data: { Loan: loan },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.ngOnInit();
        });
    }

    deleteLoan(loan: Loan) {
        const dialogRef = this.dialog.open(DialogConfirmationComponent, {
            data: {
                title: 'Eliminar préstamo',
                description:
                    'Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo?',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loanService.deleteLoan(loan.id).subscribe((result) => {
                    this.ngOnInit();
                });
            }
        });
    }

    onCleanFilter(): void {
            this.filterGame = new Game();
            this.filterClient = new Client();
            this.filterDate = undefined;
            this.onSearch();
    }

    onSearch(event?: PageEvent): void {
        const client = this.filterClient.id ? this.filterClient : undefined;
        const game = this.filterGame.id ? this.filterGame : undefined;

        const pageable: Pageable = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
        };

        if (event != null) {
            pageable.pageSize = event.pageSize;
            pageable.pageNumber = event.pageIndex;
        }

        this.loanService
            .getLoans(pageable, client, game, this.filterDate)
            .subscribe((data) => {
                this.dataSource.data = data.content;
                this.pageNumber = data.pageable.pageNumber;
                this.pageSize = data.pageable.pageSize;
                this.totalElements = data.totalElements;
            });
    }
}
