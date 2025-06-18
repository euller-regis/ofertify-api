const { sortProducts } = require('../common')

describe('sortProducts', () =>{
    const productExamples = [
        {product_name : 'iphone', id : 150, price : 2000},
        {product_name: 'office chair', id: 300, price : 100},
        {product_name : 'magic deck', id : 120, price : 150}]

    test('sorts by price', () =>{
        expect(sortProducts(productExamples, 'priceASC')).toEqual([
            {product_name: 'office chair', id: 300, price : 100},
            {product_name : 'magic deck', id : 120, price : 150},
            {product_name : 'iphone', id : 150, price : 2000},
        ])

    })

    test('sorts by price descendent', () =>{
        expect(sortProducts(productExamples, 'priceDSC')).toEqual([
                {product_name : 'iphone', id : 150, price : 2000},
                {product_name : 'magic deck', id : 120, price : 150},
                {product_name: 'office chair', id: 300, price : 100}
            ])

    })

    test('sorts by name', () =>{
        expect(sortProducts(productExamples, 'name')).toEqual([
            {product_name : 'iphone', id : 150, price : 2000},
            {product_name : 'magic deck', id : 120, price : 150},
            {product_name: 'office chair', id: 300, price : 100}            
        ])
    })
})
