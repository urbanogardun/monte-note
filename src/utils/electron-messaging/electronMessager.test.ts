import ElectronMessager from './electronMessager';

test('notifies that notebook location has not been set', () => {
    const spy = jest.spyOn(ElectronMessager, 'setLocationForNotebooks');
    
    let testDir = process.cwd();

    ElectronMessager.setLocationForNotebooks(testDir);

    expect(spy).toHaveBeenCalled();
});