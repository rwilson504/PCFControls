import { MockPCFDataSet } from "./MockPCFDataSet";

/**
 * MockPCFParameterValue represents the structure of a PCF parameter value.
 */
export type MockPCFParameterValue<T = any> = {
    raw: T;
    formatted?: string;
    [key: string]: any;
};

/**
 * MockPCFParameters provides a generic, flexible way to mock PCF context parameters.
 * Supports both params.getParameter("key") and params.key access.
 */
export class MockPCFParameters {
    [key: string]: MockPCFParameterValue | any;

    constructor(initialParams?: Record<string, MockPCFParameterValue | MockPCFDataSet>) {
        if (initialParams) {
            for (const key of Object.keys(initialParams)) {
                this[key] = initialParams[key];
            }
        }
    }

    /**
     * Set a parameter value.
     */
    setParameter(key: string, value: MockPCFParameterValue) {
        this[key] = value;
    }

    /**
     * Get a parameter value.
     */
    getParameter<T = any>(key: string): MockPCFParameterValue<T> {
        return this[key];
    }
}