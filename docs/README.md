# Flex Layout

> Este componente es una copia del [Flex Layout oficial de VTEX](https://github.com/vtex-apps/flex-layout), ajustado y mantenido por **[commente.me](https://commente.me)**.

Flex Layout es una **estructura de diseño** construida dentro del VTEX IO Store Framework. Permite crear layouts personalizados y complejos utilizando el concepto de **filas** y **columnas**, definiendo la estructura y el posicionamiento de los bloques en una página.

![Ejemplo de layout](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-flex-layout-0.png)
_Ejemplo de un layout de página construido con Flex Layout — modelo de una fila con dos columnas_

## Configuración

**Flex Layout tiene dos bloques base**: `flex-layout.row` y `flex-layout.col`. **Nunca** uses el bloque `flex-layout` directamente.

Si ya conoces el modelo [`flexbox`](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) de CSS, Flex Layout será fácil de entender, ya que `flex-layout.row` y `flex-layout.col` lo utilizan internamente.

Puedes usar **cualquier** array de bloques como hijos de `flex-layout.row` y `flex-layout.col`.

Las props marcadas con `responsive` admiten el formato [`responsive-values`](https://github.com/vtex-apps/responsive-values), lo que permite definir valores distintos según el tamaño de pantalla (`mobile` y `desktop`).

---

### `flex-layout.row`

| Prop | Tipo | Descripción | Valor por defecto |
| --- | --- | --- | --- |
| `blockClass` | `String` | Clase del contenedor del bloque. Se usa como identificador para personalizaciones CSS. | `""` |
| `border` | `String \| String[]` | Define en qué lados de la fila se aplica el borde: `top`, `right`, `bottom`, `left` o `all`. | `undefined` |
| `borderColor` | `String` | Color del borde. | `undefined` |
| `borderWidth` | `0...5` | Magnitud numérica o string para el token Tachyons `bw` aplicado a la fila. | `undefined` |
| `colGap` | `0...10` | Espaciado horizontal entre las columnas de la fila. Equivale al token `pr` de Tachyons. | `undefined` |
| `colSizing` | `equal` &#124; `auto` | Controla el ancho de las columnas en la fila. | `equal` |
| `colJustify` | `between` &#124; `around` &#124; `left` &#124; `right` &#124; `center` | Controla el espacio entre columnas y bordes de la fila, siguiendo la propiedad CSS `justify-content`. | `between` |
| `fullWidth` | `Boolean` | Si el componente debe ocupar todo el ancho disponible de su contenedor padre. | `false` |
| `horizontalAlign` | `left` &#124; `right` &#124; `center` &#124; `between` &#124; `around` | Alineación horizontal de los ítems en la fila. Por defecto es `between` si `colSizing` es `auto`, o `left` en caso contrario. | `left` |
| `htmlId` | `String` | Agrega un atributo `id` HTML al `flexRow`, permitiendo el acceso a secciones de la página mediante anclas. | `undefined` |
| `arialabel` | `String` | Etiqueta `aria-label` para fines de accesibilidad. | `undefined` |
| `marginBottom` | `0...10` | Token Tachyons `mb` aplicado a la fila. | `undefined` |
| `marginTop` | `0...10` | Token Tachyons `mt` aplicado a la fila. | `undefined` |
| `paddingBottom` | `0...10` | Token Tachyons `pb` aplicado a la fila. | `undefined` |
| `paddingTop` | `0...10` | Token Tachyons `pt` aplicado a la fila. | `undefined` |
| `preserveLayoutOnMobile` | `Boolean` | Si es `false`, la fila se convierte en una columna en mobile. | `false` |
| `preventHorizontalStretch` | `Boolean` | Evita que la fila se estire horizontalmente para llenar el ancho del padre. | `false` |
| `preventVerticalStretch` | `Boolean` | Evita que la fila se estire verticalmente usando `items-stretch`. | `false` |
| `rowGap` | `0...10` | Espaciado vertical entre columnas cuando se apilan en mobile. Equivale al token `pb` de Tachyons. | `undefined` |

---

### `flex-layout.col`

| Prop | Tipo | Descripción | Valor por defecto |
| --- | --- | --- | --- |
| `blockClass` | `String` | Clase del contenedor del bloque. Se usa como identificador para personalizaciones CSS. | `""` |
| `border` | `String \| String[]` | Define en qué lados de la columna se aplica el borde: `top`, `right`, `bottom`, `left` o `all`. | `undefined` |
| `borderColor` | `String` | Color del borde. | `undefined` |
| `borderWidth` | `0...5` | Magnitud numérica o string para el token Tachyons `bw` aplicado a la columna. | `undefined` |
| `arialabel` | `String` | Etiqueta `aria-label` para fines de accesibilidad. | `undefined` |
| `horizontalAlign` | `left` &#124; `right` &#124; `center` | Alineación horizontal de los ítems dentro de la columna. | `left` |
| `marginLeft` | `0...10` | Token Tachyons `ml` aplicado a la columna. | `undefined` |
| `marginRight` | `0...10` | Token Tachyons `mr` aplicado a la columna. | `undefined` |
| `paddingLeft` | `0...10` | Token Tachyons `pl` aplicado a la columna. | `undefined` |
| `paddingRight` | `0...10` | Token Tachyons `pr` aplicado a la columna. | `undefined` |
| `preventVerticalStretch` | `Boolean` | Evita que la columna se estire verticalmente, usando `height: auto` en lugar de `height: 100%`. | `false` |
| `rowGap` | `0...10` | Espaciado vertical entre las filas dentro de la columna. Equivale al token `pb` de Tachyons. | `undefined` |
| `verticalAlign` | `top` &#124; `middle` &#124; `bottom` | Alineación vertical de los ítems dentro de la columna. | `top` |
| `width` | `"0...100%"` &#124; `"grow"` | Ancho de la columna. Acepta un porcentaje o el valor `"grow"` (ocupa el espacio disponible). | `undefined` |

---

## Comportamiento

- El nivel más alto en un flex layout es **siempre** una fila (`flex-layout.row`). Por lo tanto, solo puedes agregar un `flex-layout.col` dentro de un `flex-layout.row` — nunca como bloque de primer nivel.
- Cada fila y columna puede tener **tantos niveles como sea necesario**.
- Al crear niveles, debes **alternar entre filas y columnas**. Solo puedes colocar columnas dentro de una fila y filas dentro de una columna.
- La estructura que defines en tu flex layout no solo afecta la organización del código, sino también cómo los bloques se muestran y gestionan en el Site Editor. Es importante **considerar tanto el código como el Site Editor al planificar el uso de flex layout** en una página.

Para entender mejor el funcionamiento práctico de Flex Layout, puedes acceder a la guía [Using Flex Layout](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-flex-layout).

---

## Personalización

Para aplicar personalizaciones CSS a este y otros bloques, consulta la guía [Using CSS Handles for store customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization).

| CSS Handle       | Descripción |
| ---------------- | ----------- |
| `flexRow`        | Elemento raíz del `flex-layout.row`. Contiene el `id` y `aria-label`. |
| `flexRowContent` | Contenedor flex de la fila. Aplicado en el mismo elemento que `flexRow`. |
| `flexCol`        | Elemento raíz del `flex-layout.col`. |
| `flexColChild`   | Aplicado en el mismo elemento que `flexCol`. Disponible para personalizaciones independientes. |
