import Observable = require("data/observable");
import RoutedValues = require('nativescript-routed-values');

export function createViewModel() {
    var viewModel : any = new Observable.Observable();

    viewModel.A1 = new RoutedValues.RoutedNumber();

    viewModel.B1 = new RoutedValues.RoutedNumber();
    viewModel.B2 = new RoutedValues.RoutedNumber();
    viewModel.A1.addChildren(viewModel.B1, viewModel.B2);

    viewModel.C1 = new RoutedValues.RoutedNumber();
    viewModel.C2 = new RoutedValues.RoutedNumber();
    viewModel.B1.addChildren(viewModel.C1, viewModel.C2);

    viewModel.C3 = new RoutedValues.RoutedNumber();
    viewModel.C4 = new RoutedValues.RoutedNumber();
    viewModel.B2.addChildren(viewModel.C3, viewModel.C4);

    viewModel.onTapA1 = function() {
        ++viewModel.A1.innerValue;
    };

    viewModel.onTapB1 = function() {
        ++viewModel.B1.innerValue;
    };
    viewModel.onTapB2 = function() {
        ++viewModel.B2.innerValue;
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
