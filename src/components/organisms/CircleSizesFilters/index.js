import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { fromFilters } from 'store/selectors';
import { toggleCircleSizeVisibility } from 'store/actions';
import { ToggleFilter, Heading } from 'components';
import { monthsDescription } from 'utils/circles';

const Cols = styled.div`
  display: flex;
  justify-content: space-around;
  
`;

const Col = styled.div`
  flex-grow: 1;
  flex-base: 1;
`;

const Holder = styled.div``;
const CircleSizesFilters = ({
  onToggle,
  sizes,
  disabled,
  layer
}) => {
  const sarr = Object.keys(sizes)
    .map(key => sizes[key]);

  const cols = [
    [ sarr[0], sarr[2], sarr[4], sarr[6] ],
    [ sarr[1], sarr[3], sarr[5], ]
  ];

  return (
    <Holder>
      <Heading
        style={{marginBottom:0}}
        level={6}>Nombre de mois secs</Heading>
      <Cols>
        { cols.map((colSizes, colKey) => (
          <Col key={colKey}>
            { colSizes.map((size, key) => (
              <ToggleFilter
                key={key}
                layer={layer}
                toggled={size.visible}
                onToggle={onToggle(size)}
                label={monthsDescription(size.name)}/>
            ))}
          </Col>
        ))}
      </Cols>
    </Holder>
  );
};

const mapDispatchToProps = dispatch => ({
  onToggle: (type)=>()=>(
    dispatch(toggleCircleSizeVisibility(type))
  )
});

const mapStateToProps = (state, ownProps) => ({
  sizes: fromFilters.circlesSizes(state),
  layer: ownProps.layer
});


export default connect(mapStateToProps, mapDispatchToProps)(CircleSizesFilters);
