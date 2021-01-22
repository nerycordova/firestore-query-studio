import "./Document.css";

/**
 * TODO: build interface based on FB document metadata
 * or at least, {id: ...}
 */
type DocumentProps = {
  document: {
    [key: string]: Record<string, any>[];
  };
};

export default function Document(props: DocumentProps) {
  if (!props.document) return null;

  return (
    <div className="document">
      <h1>{props.document.id}</h1>
      <table>
        <tbody>
          {Object.keys(props.document).map((field) => {
            if (field === "id") return null;
            const val = props.document[field];
            return (
              <tr key={props.document.id.toString() + "_" + field}>
                <td className="field-name">{field}:</td>
                <td className="field-value">
                  {typeof val === "object" ? <pre>{JSON.stringify(val, null, 2)}</pre> : val}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
