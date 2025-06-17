function sort(list, sortType){
    if(sortType === 'priceASC'){
        const sortedASC = list.sort(function(a, b){ return a-b})
        return sortedASC
    }
    if(sortType === 'priceDSC'){
        const sortedDSC = list.sort(function(a, b){ return a-b})
        return sortedDSC.reverse()
    }
}

module.exports = sort