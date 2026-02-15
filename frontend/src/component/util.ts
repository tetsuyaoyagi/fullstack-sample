
export type MonoProperty<field_name extends string, Property> = {[FieldName in field_name]: Property};
