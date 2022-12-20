import React, { useState, useEffect, ChangeEvent } from "react";
import Pagination from "./Pagination";

export default class MoviesGrid extends React.PureComponent<{}, { loaded: boolean, name?: string, data?: Paged<Movie>, page: number }> {
    public state = {
        loaded: false,
        name: "",
        data: new Paged<Movie>(),
        page: 1
    };

    componentDidMount() {
        this.loadData();
    }

    loadData(page?: number) {
        if (page !== null && page !== undefined) {
            this.state.page = page;
            //this.state.loaded = false;
            this.forceUpdate();
        }

        fetch("/api/movies?page=" + this.state.page + "&name=" + (this.state.name ?? ""))
            .then(response => response.json())
            .then(jsonData => jsonData as Paged<Movie>)
            .then(items => this.setState({ data: items, loaded: true }));
    }

    setName(name: string) {
        this.setState({ name });
    }

    public render() {
        const results: React.ReactFragment[] = [];
        var count = this.state.data?.total ?? 0;
        var items = this.state.data?.items;
        var hasException = this.state.data !== null && this.state.data !== undefined && this.state.data.exception !== undefined && this.state.data.exception !== null;
        if (items !== undefined && items !== null)
            items.forEach((movie:Movie, index:number) => {
                results.push(
                    <tr key={index}>
                        <td>{movie.title}</td>
                        <td>{movie.year}</td>
                    </tr>,
                );
            });

        const handleClick = () => {
            this.setState({ data: undefined, loaded: false });
            this.loadData();
        };

        return (
            <div>
                <form className="d-flex">
                    <div className="flex-grow-1">
                        Movies
                    </div>
                    <div className="text-right flex-grow-0">
                        <div className="form-row align-items-center">
                            <div className="col-auto">
                                <label className="sr-only" htmlFor="inlineFormInput">Name</label>
                                <input type="text" className="form-control mb-2" id="inlineFormInput" placeholder="Title" value={this.state.name} onChange={(e) => this.setName(e.target.value)} />
                            </div>
                            <div className="col-auto">
                                <button type="button" className="btn btn-primary mb-2" onClick={handleClick}>Filter</button>
                                {/*<button type="button" className="btn btn-secondary mb-2 ml-2">Clear</button>*/}
                            </div>
                        </div>
                    </div>
                </form>
                <table className="table table-bordered table-striped table-hover w-100">
                    <thead>
                        <tr><th>Title</th><th>Year</th></tr>
                    </thead>
                    <tbody>
                        {
                            !this.state.loaded ? <tr><td className="text-danger" colSpan={2}>Loading...</td></tr> :
                                count == 0 ? <tr><td className="text-danger" colSpan={2}>No movies have been found.</td></tr> :
                                hasException ? <tr><td className="text-danger" colSpan={2}>{this.state.data.exception}</td></tr> :
                                results
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={2}>
                                <div className="d-flex flex-row">
                                    <div className="flex-grow-1">Total Rows: {count}</div>
                                    <div className="flex-grow-0 text-right">
                                        <Pagination totalRows={count} page={1} pageSize={10} maxPages={7} onChanged={(data) => this.loadData(data.page)} />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
}

class Paged<TItem> {
    constructor() {
        this._items = undefined;
        this._total = 0;
        this._exception = undefined;
    }

    private _items?: TItem[];
    private _total: number;
    private _exception?: string;

    get items(): TItem[] | undefined {
        return this._items;
    }
    set items(value: TItem[] | undefined) {
        this._items = value;
    }

    get total(): number {
        return this._total;
    }
    set total(value: number) {
        this._total = value;
    }

    get exception(): string | undefined {
        return this._exception;
    }
    set exception(value: string | undefined) {
        this._exception = value;
    }
}
class Movie {
    constructor() {
        this._title = undefined;
        this._year = undefined;
    }

    private _title?: string;
    private _year?: number;

    set title(value: string | undefined) {
        this._title = value;
    }
    get title(): string | undefined {
        return this._title;
    }

    set year(value: number | undefined) {
        this._year = value;
    }
    get year(): number | undefined {
        return this._year;
    }
}