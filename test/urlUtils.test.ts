import { encodeColumnFilters } from "@//utils/urlUtils";

test('can encode column filters without error', () => {
    expect(encodeColumnFilters({ "key": "value" })).toBeDefined();
})

