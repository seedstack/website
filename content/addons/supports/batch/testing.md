---
title: "Testing"
type: "addon"
zones:
    - "Addons"
tags:
    - "batch"
    - "test"
    - "cli"
sections:
    - "AddonsSupports"
subsections:
    - "Spring batch"
menu:
    AddonsSupportsSpringBatch:
        weight: 40
---

For integration test, add SEED integration test support to your project. Check the documentation [here](/docs/seed/manual/testing/integration).

* Following example checks that SEED injection works.


    @RunWith(SeedITRunner.class)
    public class RunnerBatchIT {
        @Inject
        MessageService messageService;
     
        @Test
        @WithCommandLine(value = {"--job", "mySimpleJob"}, expectedExitCode = 0)
        public void testBatch() {
                assertThat(messageService).isNotNull();
        }
    }
 
As illustrated below, note that `@WithCommandLine` can also carry job parameters. Following equivalent syntaxes:

- "`-PparameterKey=parameterValue`" 
- "`-P parameterKey=parameterValue`"
- "`--jobParameter", "parameterKey=parameterValue`"


    @Test
    @WithCommandLine(value = {"--job","mySimpleJob","--jobParameter","key=value"}, expectedExitCode=0)
    public void execute_batch_with_multiple_parameters() {
        ...
    }
