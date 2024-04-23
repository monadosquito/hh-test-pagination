import { ReactNode, useState } from 'react'


type Props<A> = {
    pageSize: number
    currJumpBtnsSeqSize: number
    xs: A[]
    comp: (xs: A[]) => (props: Record<string, any>) => ReactNode
    compProps: Record<string, any>
}

type Step = 'left' | 'right'


function page<A>(currJumpBtnsSeqSize: number, i: number, xs: A[]) {
    const startI = i * currJumpBtnsSeqSize
    const endI = startI + currJumpBtnsSeqSize
    return xs.slice(startI, endI)
}


function sub<A>(currJumpBtnsSeqSize: number, xs: A[]): A[][] {
    const subArrsCnt = xs.length / currJumpBtnsSeqSize
    return Array.from(
        { length: subArrsCnt },
        (_, i) => page(currJumpBtnsSeqSize, i, xs),
    )
}

function Pag<A>({
    comp,
    compProps,
    pageSize,
    currJumpBtnsSeqSize,
    xs,
}: Props<A>) {
    const remPage = xs.length % pageSize ? 1 : 0
    const pagesCnt = xs.length / pageSize + remPage
    const [ currPage, setCurrPage ] = useState(0)
    const jump = (page: number) => () => {
        if (page >= 0 && page < pagesCnt - remPage) setCurrPage(page)
    }
    const leftPage = currPage - 1
    const rightPage = currPage + 1
    const step = (step: Step): () => void =>
        step === 'left' ? jump(leftPage) : jump(rightPage)

    const startIx = currPage * pageSize
    const endIx = startIx + pageSize
    const currXs = xs.slice(startIx, endIx)
    const firstPage = 0
    const lastPage = pagesCnt - 1
    const currJumpBtnsSetIx = Math.floor(currPage / currJumpBtnsSeqSize)
    const allJumpBtnsIxs = Array.from({ length: pagesCnt }, (_, i) => i)
    const currJumpBtnsIxs =
        sub(currJumpBtnsSeqSize, allJumpBtnsIxs)[currJumpBtnsSetIx]
    const jumpBtns = currJumpBtnsIxs.map((i) =>
        <li onClick={jump(i)} className='page-item' key={i}>
            <a className={'page-link' + (i === currPage ? ' active' : '')}>
                {i + 1}
            </a>
        </li>
    )

    const Pager =
        <aside>
            <ul className='pagination'>
                <li onClick={jump(firstPage)} className='page-item'>
                    <a className='page-link sr-only'>
                        <span>&laquo;</span>
                    </a>
                </li>
                <li onClick={step('left')}>
                    <a className='page-link'>
                        {'<'}
                    </a>
                </li>
                {jumpBtns}
                <li onClick={step('right')}>
                    <a className='page-link'>
                        {'>'}
                    </a>
                </li>
                <li onClick={jump(lastPage)}>
                    <a className='page-link'>
                        <span>&raquo;</span>
                    </a>
                </li>
            </ul>
        </aside>

    return (
        <div>
        {comp(currXs)(compProps)}
        {Pager}
        </div>
    )
}


export { Pag }
