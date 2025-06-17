const sort = require('../common')

test('sorts by price', () =>{
    expect(sort([3, 5, 1], 'priceASC')).toEqual([1, 3, 5])

})

test('sorts by price descendent', () =>{
    expect(sort([3, 5, 1], 'priceDSC')).toEqual([5, 3, 1])

})