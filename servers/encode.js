const testHarness = `
def test_harness(two_sum):
    test_cases = [
        {"input": {"nums": [2, 7, 11, 15], "target": 9}, "expected_output": [0, 1]},
        {"input": {"nums": [3, 2, 4], "target": 6}, "expected_output": [1, 2]},
        {"input": {"nums": [3, 3], "target": 6}, "expected_output": [0, 1]},
        {"input": {"nums": [-1, -2, -3, -4, -5], "target": -8}, "expected_output": [2, 4]},
        {"input": {"nums": [1, 2, 3, 4, 5, 6], "target": 11}, "expected_output": [4, 5]},
    ]
    results = []
    for case in test_cases:
        nums, target = case["input"]["nums"], case["input"]["target"]
        output = two_sum(nums, target)
        results.append({
            "input": case["input"],
            "output": output,
            "passed": sorted(output) == sorted(case["expected_output"])
        })
    return results

test_results = test_harness(two_sum)
for result in test_results:
    print(result)
`;

const encodedTestHarness = Buffer.from(testHarness).toString('base64');
console.log(encodedTestHarness);

/*

*/