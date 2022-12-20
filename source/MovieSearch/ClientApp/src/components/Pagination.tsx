import React from "react";

export default class Pagination extends React.PureComponent<{ totalRows: number, page: number, pageSize: number, maxPages: number, onChanged: (state: { page: number }) => any }, { page:number }> {

    public state = {
        page: 1,
    };

    private totalPages : number = 0;

    update(data: any) {
        this.setState(data);
        this.props.onChanged(data);
    }

    goto(state: { page: string }) {
        if (state?.page !== null)
            this.update({ page: +state.page });
    }

    next() {
        this.update({ page: this.state.page + 1 });
    }

    first() {
        this.update({ page: 1 });
    }

    previous() {
        this.update({ page: this.state.page - 1 });
    }

    last() {
        this.update({ page: this.totalPages });
    }

    componentDidMount() {
        this.setState({ page: this.props.page });
    }

    public render() {

        const pages: React.ReactFragment[] = [];
        function pageItem(enabled: boolean = true) {
            return enabled ? "page-item" : "page-item disabled";
        }
        var totalPages = Math.trunc((this.props.totalRows - 1) / this.props.pageSize) + 1;
        var pageIndex = Math.min(totalPages, this.state.page);
        var start = Math.max(Math.min(pageIndex + (this.props.maxPages - 1) / 2, totalPages) - this.props.maxPages + 1, 1);
        var stop = Math.min(totalPages, start + this.props.maxPages - 1);
        let showFirst = true, showLast = true;
        let canPrevious = pageIndex > 1, canNext = pageIndex < totalPages;

        this.totalPages = totalPages;
        if (start > 0)
            for (var i = start; i <= stop; i++) {
                pages.push(
                    <li className={pageItem(this.state.page !== i)} key={i}><a className="page-link" href="#" data-page={i} onClick={(e) => { e.preventDefault(); this.goto({ page: e.currentTarget.getAttribute('data-page') }); }}>{i}</a></li>
                );
            };

        return <nav aria-label="Grid navigation">
            <ul className="pagination pagination-sm">
                {showFirst && <li className={pageItem(canPrevious)}><a className="page-link" href="#" onClick={(e) => { e.preventDefault(); this.first() }}>First</a></li>}
                <li className={pageItem(canPrevious)}><a className="page-link" href="#" onClick={(e) => { e.preventDefault(); this.previous()}}>Previous</a></li>
                { pages }
            <li className={pageItem(canNext)}><a className="page-link" href="#" onClick={(e) => { e.preventDefault(); this.next() }}>Next</a></li>
                {showLast && <li className={pageItem(canNext)}><a className="page-link" href="#" onClick={(e) => { e.preventDefault(); this.last()}}>Last</a></li>}
            </ul>
        </nav>
    }
}