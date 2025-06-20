function sortProducts(list, sortType){
    if(sortType === 'priceASC'){
        const sortedASC = list.sort(function(a, b){ return a.price - b.price})
        return sortedASC
    }
    if(sortType === 'priceDSC'){
        const sortedDSC = list.sort(function(a, b){ return b.price - a.price})
        return sortedDSC
    }
    if(sortType === 'name'){
        const sortedASC = list.sort(function(a, b){ return a.product_name.localeCompare(b.product_name) })
        return sortedASC
    }
}

function paginate(list, page, page_size){
    const pg = Number(page)
    const pgsz = Number(page_size)
    const currentPage = list.slice((pg-1) * pgsz, pg * pgsz)
    return currentPage
}

const commons = {
    sortProducts : sortProducts,
        paginate : paginate
}
module.exports = commons