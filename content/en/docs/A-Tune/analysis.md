# analysis<a name="EN-US_TOPIC_0213225932"></a>

## Function<a name="section124121426195015"></a>

Collect real-time statistics from the system to identify and automatically optimize workload types.

## Format<a name="section1019897115110"></a>

**atune-adm analysis**  \[OPTIONS\]

## Parameter Description<a name="section16755152320311"></a>

-   OPTIONS

    <a name="table17341193974513"></a>
    <table><thead align="left"><tr id="row11341739154514"><th class="cellrowborder" valign="top" width="23.87%" id="mcps1.1.3.1.1"><p id="p3341183964511"><a name="p3341183964511"></a><a name="p3341183964511"></a>Parameter</p>
    </th>
    <th class="cellrowborder" valign="top" width="76.13%" id="mcps1.1.3.1.2"><p id="p73410399457"><a name="p73410399457"></a><a name="p73410399457"></a>Description</p>
    </th>
    </tr>
    </thead>
    <tbody><tr id="row334110395452"><td class="cellrowborder" valign="top" width="23.87%" headers="mcps1.1.3.1.1 "><p id="p9341639104517"><a name="p9341639104517"></a><a name="p9341639104517"></a>--model, -m</p>
    </td>
    <td class="cellrowborder" valign="top" width="76.13%" headers="mcps1.1.3.1.2 "><p id="p23414394459"><a name="p23414394459"></a><a name="p23414394459"></a>Model generated by user-defined training</p>
    </td>
    </tr>
    </tbody>
    </table>


## Example<a name="section5961238145111"></a>

-   Use the default model for classification and identification.

    ```
    # atune-adm analysis
    ```

-   Use the user-defined training model for recognition.

    ```
    # atune-adm analysis --model /usr/libexec/atuned/analysis/models/new-model.m
    ```

