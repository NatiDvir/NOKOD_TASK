import { describe, it, expect } from 'vitest'
import { toTitleCase } from '../utils'

describe('toTitleCase', () => {
  it('should convert camelCase to Title Case', () => {
    expect(toTitleCase('camelCase')).toBe('Camel Case')
    expect(toTitleCase('helloWorld')).toBe('Hello World')
    expect(toTitleCase('thisIsATest')).toBe('This Is A Test')
  })

  it('should handle single words', () => {
    expect(toTitleCase('hello')).toBe('Hello')
    expect(toTitleCase('test')).toBe('Test')
    expect(toTitleCase('a')).toBe('A')
  })

  it('should handle strings that start with capital letters', () => {
    expect(toTitleCase('PascalCase')).toBe(' Pascal Case')
    expect(toTitleCase('HelloWorld')).toBe(' Hello World')
    expect(toTitleCase('TestCase')).toBe(' Test Case')
  })

  it('should handle empty strings', () => {
    expect(toTitleCase('')).toBe('')
  })

  it('should handle strings with consecutive capital letters', () => {
    expect(toTitleCase('XMLHttpRequest')).toBe(' X M L Http Request')
    expect(toTitleCase('HTMLElement')).toBe(' H T M L Element')
  })

  it('should handle strings with numbers', () => {
    expect(toTitleCase('test123')).toBe('Test123')
    expect(toTitleCase('api2Version')).toBe('Api2 Version')
  })

  it('should handle strings with special characters', () => {
    expect(toTitleCase('test-case')).toBe('Test-case')
    expect(toTitleCase('test_case')).toBe('Test_case')
    expect(toTitleCase('test.case')).toBe('Test.case')
  })

  it('should handle single character strings', () => {
    expect(toTitleCase('a')).toBe('A')
    expect(toTitleCase('A')).toBe(' A')
    expect(toTitleCase('1')).toBe('1')
  })

  it('should handle strings with mixed case', () => {
    expect(toTitleCase('testCASE')).toBe('Test C A S E')
    expect(toTitleCase('MixedCaseString')).toBe(' Mixed Case String')
  })

  it('should handle common automation field names', () => {
    expect(toTitleCase('creationTime')).toBe('Creation Time')
    expect(toTitleCase('automationType')).toBe('Automation Type')
    expect(toTitleCase('statusCode')).toBe('Status Code')
    expect(toTitleCase('id')).toBe('Id')
    expect(toTitleCase('name')).toBe('Name')
    expect(toTitleCase('type')).toBe('Type')
    expect(toTitleCase('status')).toBe('Status')
  })
})
