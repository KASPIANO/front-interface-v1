import { BackendValidationErrorsType } from '../DAL/BackendDAL';

export const hasErrors = (formErrors: BackendValidationErrorsType, field: string) =>
    formErrors[field] && formErrors[field].length > 0;

export const getErrorMessage = (formErrors: BackendValidationErrorsType, field: string) =>
    hasErrors(formErrors, field) ? formErrors[field].join(', ') : null;

export const addErrorToField = (
    formErrors: BackendValidationErrorsType,
    setFormErrors: (formErrors: BackendValidationErrorsType) => void,
    field: string,
    error: string,
) => {
    const fieldErrors = formErrors[field] || [];
    setFormErrors({ ...formErrors, [field]: fieldErrors.concat([error]) });
};

export const setErrorToField = (
    formErrors: BackendValidationErrorsType,
    setFormErrors: (formErrors: BackendValidationErrorsType) => void,
    field: string,
    error: string,
) => {
    const fieldErrors = formErrors[field] || [];
    setFormErrors({ ...formErrors, [field]: [error] });
};

export const clearFieldErrors = (
    formErrors: BackendValidationErrorsType,
    setFormErrors: (formErrors: BackendValidationErrorsType) => void,
    field: string,
) => {
    const newFormErrors = { ...formErrors };

    delete newFormErrors[field];
    setFormErrors(newFormErrors);
};

export const clearFormErrors = (setFormErrors: (formErrors: BackendValidationErrorsType) => void) => {
    setFormErrors({});
};

export const clearFieldErrorsAndSetFieldValue = (
    formErrors: BackendValidationErrorsType,
    setFormErrors: (formErrors: BackendValidationErrorsType) => void,
    field: string,
    setFieldValue: () => void,
) => {
    clearFieldErrors(formErrors, setFormErrors, field);
    setFieldValue();
}
