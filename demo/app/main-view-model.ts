import Observable = require("data/observable");
import RoutedValues = require('nativescript-routed-values');

export function createViewModel() {
    var viewModel : any = new Observable.Observable();

    var valueChanged = (newValue, obj) => {
        console.log('Value of "' + obj.name + '" changed: ' + newValue);
    };

    viewModel.A1 = new RoutedValues.RoutedNumber();
    viewModel.A1.name = 'A1';
    viewModel.A1.onValueChanged(valueChanged);

    viewModel.B1 = new RoutedValues.RoutedNumber();
    viewModel.B1.name = 'B1';
    viewModel.B1.onValueChanged(valueChanged);
    viewModel.B2 = new RoutedValues.RoutedNumber();
    viewModel.B2.name = 'B2';
    viewModel.B2.onValueChanged(valueChanged);
    viewModel.A1.addChildren(viewModel.B1, viewModel.B2);

    viewModel.C1 = new RoutedValues.RoutedNumber();
    viewModel.C1.name = 'C1';
    viewModel.C1.onValueChanged(valueChanged);
    viewModel.C2 = new RoutedValues.RoutedNumber();
    viewModel.C2.name = 'C2';
    viewModel.C2.onValueChanged(valueChanged);
    viewModel.B1.addChildren(viewModel.C1, viewModel.C2);

    viewModel.C3 = new RoutedValues.RoutedNumber();
    viewModel.C3.name = 'C3';
    viewModel.C3.onValueChanged(valueChanged);
    viewModel.C4 = new RoutedValues.RoutedNumber();
    viewModel.C4.name = 'C4';
    viewModel.C4.onValueChanged(valueChanged);
    viewModel.B2.addChildren(viewModel.C3, viewModel.C4);

    viewModel.onTapA1 = function() {
        viewModel.A1.innerValue = viewModel.A1.innerValue + 1;
    };

    viewModel.onTapB1 = function() {
        viewModel.B1.innerValue = viewModel.B1.innerValue + 1;
    };
    viewModel.onTapB2 = function() {
        viewModel.B2.innerValue = viewModel.B2.innerValue + 1;
    };

    viewModel.resetA = function() {
        viewModel.A1.innerValue = 0;
    };
    viewModel.resetB = function() {
        viewModel.B1.innerValue = 0;
        viewModel.B2.innerValue = 0;
    };
    viewModel.resetC = function() {
        viewModel.C1.innerValue = 0;
        viewModel.C2.innerValue = 0;
        viewModel.C3.innerValue = 0;
        viewModel.C4.innerValue = 0;
    };

    return viewModel;
}
